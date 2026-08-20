<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Cache-Control: public, max-age=180'); // Cache 3 minutes

$icsUrl = "https://calendar.google.com/calendar/ical/9edol05k9ov7vnr7o9idllguk0%40group.calendar.google.com/public/basic.ics";

$ctx = stream_context_create([
    'http' => [
        'timeout' => 5,
        'user_agent' => 'SG-Gersfeld-Calendar-Proxy/1.0'
    ]
]);

$icsText = @file_get_contents($icsUrl, false, $ctx);

if (!$icsText) {
    // Fallback to local file if available
    $local = __DIR__ . '/../../src/data/basic.ics';
    if (file_exists($local)) {
        $icsText = file_get_contents($local);
    }
}

if (!$icsText) {
    http_response_code(502);
    echo json_encode(['error' => 'Could not fetch Google Calendar']);
    exit;
}

function parseICSDate($str) {
    if (!$str) return null;
    $clean = preg_replace('/[^0-9TZ]/', '', $str);
    if (strlen($clean) === 8) {
        $y = intval(substr($clean, 0, 4));
        $m = intval(substr($clean, 4, 2));
        $d = intval(substr($clean, 6, 2));
        return gmmktime(0, 0, 0, $m, $d, $y);
    }
    if (strlen($clean) >= 15) {
        $y = intval(substr($clean, 0, 4));
        $m = intval(substr($clean, 4, 2));
        $d = intval(substr($clean, 6, 2));
        $h = intval(substr($clean, 9, 2));
        $min = intval(substr($clean, 11, 2));
        $s = intval(substr($clean, 13, 2));
        if (substr($clean, -1) === 'Z') {
            return gmmktime($h, $min, $s, $m, $d, $y);
        }
        return mktime($h, $min, $s, $m, $d, $y);
    }
    return null;
}

function getLastSaturdayTimestamp($year, $month, $hours = 9, $minutes = 0) {
    $lastDay = mktime(0, 0, 0, $month + 1, 0, $year);
    $dayOfWeek = intval(date('w', $lastDay)); // 0 = Sun, 6 = Sat
    $diff = ($dayOfWeek >= 6) ? $dayOfWeek - 6 : $dayOfWeek + 1;
    $satDay = intval(date('j', $lastDay)) - $diff;
    return mktime($hours, $minutes, 0, $month, $satDay, $year);
}

$unfolded = preg_replace('/\r?\n[ \t]/', '', $icsText);
$lines = preg_split('/\r?\n/', $unfolded);
$events = [];
$cur = null;

foreach ($lines as $line) {
    if (strpos($line, 'BEGIN:VEVENT') === 0) {
        $cur = ['desc' => '', 'loc' => '', 'exdates' => [], 'rrule' => ''];
    } elseif (strpos($line, 'END:VEVENT') === 0) {
        if ($cur && !empty($cur['summary']) && !empty($cur['start'])) {
            $s = trim($cur['summary']);
            $sLow = mb_strtolower($s, 'UTF-8');
            
            $cat = 'Sonstiges';
            if (strpos($sLow, 'vorstandssitzung') !== false) {
                $cat = 'Vorstandssitzung';
            } elseif (preg_match('/\b(vm|bm|lm)\b|meisterschaft/i', $s)) {
                $cat = 'Meisterschaft';
            } elseif (strpos($sLow, 'arbeitseinsatz') !== false) {
                $cat = 'Arbeitseinsatz';
            } elseif (strpos($sLow, 'training') === false && strpos($sLow, 'rwk') === false) {
                $cat = 'Allgemein';
            } else {
                $cat = 'Training / RWK';
            }

            $events[] = [
                'id' => $cur['uid'] ?? uniqid(),
                'summary' => $s,
                'description' => trim($cur['desc']),
                'location' => trim($cur['loc']),
                'startTime' => $cur['start'],
                'isAllDay' => !empty($cur['isAllDay']),
                'category' => $cat
            ];

            // Expand monthly recurring RRULE (e.g. Arbeitseinsatz every last Saturday)
            if (!empty($cur['rrule']) && strpos($cur['rrule'], 'FREQ=MONTHLY') !== false && strpos($cur['rrule'], 'BYDAY=-1SA') !== false) {
                $startYear = intval(date('Y', $cur['start']));
                $startMonth = intval(date('n', $cur['start']));
                $hours = intval(date('G', $cur['start']));
                $minutes = intval(date('i', $cur['start']));

                $currentYear = intval(date('Y'));
                $currentMonth = intval(date('n'));

                for ($offset = 0; $offset < 14; $offset++) {
                    $tMonth = $currentMonth + $offset;
                    $tYear = $currentYear + intdiv($tMonth - 1, 12);
                    $tMonth = (($tMonth - 1) % 12) + 1;

                    if ($tYear < $startYear || ($tYear === $startYear && $tMonth < $startMonth)) continue;

                    $satTs = getLastSaturdayTimestamp($tYear, $tMonth, $hours, $minutes);
                    $dateStr = date('Ymd', $satTs);

                    $isExcluded = false;
                    foreach ($cur['exdates'] as $ex) {
                        if (strpos($ex, $dateStr) !== false) {
                            $isExcluded = true;
                            break;
                        }
                    }

                    if (!$isExcluded) {
                        $events[] = [
                            'id' => ($cur['uid'] ?? 'arbeitseinsatz') . '-' . $dateStr,
                            'summary' => $s,
                            'description' => trim($cur['desc']),
                            'location' => trim($cur['loc']),
                            'startTime' => $satTs,
                            'isAllDay' => false,
                            'category' => $cat
                        ];
                    }
                }
            }
        }
        $cur = null;
    } elseif ($cur) {
        $colonIdx = strpos($line, ':');
        if ($colonIdx === false) continue;
        $keyPart = substr($line, 0, $colonIdx);
        $val = substr($line, $colonIdx + 1);
        $keyArr = explode(';', $keyPart);
        $k = $keyArr[0];

        $v = str_ireplace('\n', "\n", $val);
        $v = str_replace(['\,', '\;', '\\\\'], [',', ';', '\\'], $v);

        if ($k === 'UID') $cur['uid'] = $val;
        elseif ($k === 'SUMMARY') $cur['summary'] = $v;
        elseif ($k === 'DESCRIPTION') $cur['desc'] = $v;
        elseif ($k === 'LOCATION') $cur['loc'] = $v;
        elseif ($k === 'RRULE') $cur['rrule'] = $val;
        elseif ($k === 'EXDATE') $cur['exdates'][] = $val;
        elseif ($k === 'DTSTART') {
            $cur['start'] = parseICSDate($val);
            $cur['isAllDay'] = (strlen(preg_replace('/[^0-9]/', '', $val)) === 8);
        }
    }
}

// Filter strictly for today and upcoming
$todayMidnight = mktime(0, 0, 0, intval(date('n')), intval(date('j')), intval(date('Y')));
$upcomingEvents = array_filter($events, function($e) use ($todayMidnight) {
    return $e['startTime'] >= $todayMidnight;
});

// Sort ascending by start time
usort($upcomingEvents, function($a, $b) {
    return $a['startTime'] - $b['startTime'];
});

echo json_encode([
    'events' => array_values($upcomingEvents),
    'total' => count($upcomingEvents)
]);
