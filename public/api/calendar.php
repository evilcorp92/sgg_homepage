<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Cache-Control: public, max-age=300'); // Cache for 5 minutes

$icsUrl = "https://calendar.google.com/calendar/ical/9edol05k9ov7vnr7o9idllguk0%40group.calendar.google.com/public/basic.ics";

$ctx = stream_context_create([
    'http' => [
        'timeout' => 5,
        'user_agent' => 'SG-Gersfeld-Calendar-Proxy/1.0'
    ]
]);

$icsText = @file_get_contents($icsUrl, false, $ctx);

if (!$icsText) {
    http_response_code(502);
    echo json_encode(['error' => 'Could not fetch Google Calendar']);
    exit;
}

echo json_encode(['ics' => $icsText]);
