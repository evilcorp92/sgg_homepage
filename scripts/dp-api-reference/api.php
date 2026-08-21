<?php
/**
 * SG Gersfeld 1813 e.V. - Dienstplan JSON API
 * 
 * Bereitstellung von Live-Schießzeiten, Status (Heute geöffnet/geschlossen),
 * nächster Schießzeit und anstehenden Terminen mit eingeteilten Aufsichten.
 * 
 * Datei: api.php (auf dp.sg-gersfeld.de im Hauptverzeichnis ablegen)
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Bei OPTIONS-Preflight direkt antworten
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

include_once './database.php';

try {
    $db = new database();
    $tage = $db->getWochentage();

    // 1. Alle anstehenden Termine ab Beginn des heutigen Tages abrufen
    $today = date('Y-m-d');
    $now = date('Y-m-d H:i:s');

    // Abfrage der nächsten 30 Termine ab heute
    $sql = "SELECT dp_Termine.Termin, dp_Termine.Datum, dp_Termine.Schicht, 
                   dp_Schichten.Beginn, dp_Schichten.Ende, dp_Schichten.Bezeichnung
            FROM dp_Termine 
            INNER JOIN dp_Schichten ON dp_Termine.Schicht = dp_Schichten.ID
            WHERE dp_Termine.Datum >= :today
            ORDER BY dp_Termine.Datum ASC, dp_Schichten.Beginn ASC
            LIMIT 40";

    $stmt = $db->connection->prepare($sql);
    $stmt->execute([':today' => $today]);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $upcomingSessions = [];
    $todaySession = null;
    $todayOpen = false;
    $nextSession = null;

    foreach ($rows as $row) {
        $terminId = (int)$row['Termin'];
        $aufsichtenRaw = $db->getAufsichten($terminId);

        // Nur Termine berücksichtigen, an denen mindestens eine Aufsicht/Schießwart eingeteilt ist!
        if (empty($aufsichtenRaw)) {
            continue;
        }

        // Aufsichten formatieren
        $staffList = [];
        foreach ($aufsichtenRaw as $key => $val) {
            $funktion = $db->getFunktion($key);
            $name = $db->getName($val);
            if (!empty($name)) {
                $staffList[] = [
                    'funktion' => $funktion,
                    'name' => $name
                ];
            }
        }

        if (empty($staffList)) {
            continue;
        }

        $datumTimestamp = strtotime($row['Datum']);
        $wochentagIndex = (int)date('w', $datumTimestamp);
        $wochentagName = isset($tage[$wochentagIndex]['Name']) ? $tage[$wochentagIndex]['Name'] : date('l', $datumTimestamp);

        // Disziplin-Schlüssel für CSS / Filterung ermitteln
        $discLower = strtolower($row['Bezeichnung']);
        $discKey = 'allgemein';
        if (strpos($discLower, 'ipsc') !== false) {
            $discKey = 'ipsc';
        } elseif (strpos($discLower, 'bds') !== false || strpos($discLower, 'fallscheibe') !== false || strpos($discLower, 'speed') !== false || strpos($discLower, 'mehrdistanz') !== false) {
            $discKey = 'bds';
        } elseif (strpos($discLower, 'dsb') !== false || strpos($discLower, 'luft') !== false || strpos($discLower, 'kk') !== false || strpos($discLower, 'kleinkaliber') !== false || strpos($discLower, 'statisch') !== false) {
            $discKey = 'dsb';
        } elseif (strpos($discLower, 'western') !== false || strpos($discLower, 'vorderlader') !== false || strpos($discLower, 'unterhebel') !== false) {
            $discKey = 'western';
        } elseif (strpos($discLower, 'bogen') !== false) {
            $discKey = 'bogen';
        }

        $sessionData = [
            'id' => $terminId,
            'datum' => $row['Datum'],
            'datumFormatted' => date('d.m.Y', $datumTimestamp),
            'wochentag' => $wochentagName,
            'wochentagShort' => substr($wochentagName, 0, 2),
            'beginn' => substr($row['Beginn'], 0, 5),
            'ende' => substr($row['Ende'], 0, 5),
            'zeit' => substr($row['Beginn'], 0, 5) . ' — ' . substr($row['Ende'], 0, 5) . ' Uhr',
            'bezeichnung' => $row['Bezeichnung'],
            'disciplineKey' => $discKey,
            'aufsichten' => $staffList,
            'isToday' => ($row['Datum'] === $today)
        ];

        // Prüfen, ob dieser Termin heute ist
        $terminEndeDateTime = $row['Datum'] . ' ' . $row['Ende'];
        if ($row['Datum'] === $today) {
            // Wenn der heutige Termin noch nicht vorbei ist oder heute stattfindet
            $todaySession = $sessionData;
            if ($terminEndeDateTime >= $now) {
                $todayOpen = true;
            }
        }

        // Nächste anstehende Schießzeit (ab aktuellem Zeitpunkt)
        if ($terminEndeDateTime >= $now && $nextSession === null) {
            $nextSession = $sessionData;
        }

        // Zur Liste der kommenden Schießzeiten hinzufügen
        if ($terminEndeDateTime >= $now) {
            $upcomingSessions[] = $sessionData;
        }
    }

    echo json_encode([
        'status' => 'success',
        'serverTime' => date('Y-m-d H:i:s'),
        'today' => $today,
        'todayOpen' => $todayOpen,
        'todaySession' => $todaySession,
        'nextSession' => $nextSession,
        'upcoming' => array_slice($upcomingSessions, 0, 10)
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
