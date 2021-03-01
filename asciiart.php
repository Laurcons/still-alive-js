<?php

$files = scandir("graphics");

$art = [];
foreach ($files as $file) {
    if ($file == "." || $file == "..")
        continue;
    $parts = pathinfo($file);
    $art[$parts["filename"]] = file_get_contents("graphics/".$file);
}

$timeline = [
    [
        "startTime" => 23924,
        "endTime" => 36079,
        "text" => $art["aperture"]
    ], [
        "startTime" => 36079,
        "endTime" => 38224,
        "text" => $art["radioactive"]
    ], [
        "text" => $art["aperture"],
        "startTime" => 38224,
        "endTime" => 46051
    ], [
        "text" => $art["atom"],
        "startTime" => 46051,
        "endTime" => 49952
    ], [
        "text" => $art["aperture"],
        "startTime" => 49952,
        "endTime" => 70000
    ], [
        "text" => $art["heart"],
        "startTime" => 70000,
        "endTime" => 75478
    ], [
        "text" => $art["explosion"],
        "startTime" => 75478,
        "endTime" => 83150
    ], [
        "text" => $art["fire"],
        "startTime" => 83150,
        "endTime" => 88005
    ], [
        "text" => $art["ok"],
        "startTime" => 88005,
        "endTime" => 98003
    ], [
        "text" => $art["explosion"],
        "startTime" => 98003,
        "endTime" => 100116
    ], [
        "text" => $art["atom"],
        "startTime" => 100116,
        "endTime" => 102190
    ], [
        "text" => $art["aperture"],
        "startTime" => 102190,
        "endTime" => 128000
    ], [
        "text" => $art["blackmesa"],
        "startTime" => 128000,
        "endTime" => 138378
    ], [
        "text" => $art["keeki"],
        "startTime" => 138378,
        "endTime" => 144304
    ], [
        "text" => $art["radioactive"],
        "startTime" => 144304,
        "endTime" => 146409
    ], [
        "text" => $art["aperture"],
        "startTime" => 146409,
        "endTime" => 150345
    ], [
        "text" => $art["atom"],
        "startTime" => 150345,
        "endTime" => 152378
    ], [
        "text" => $art["explosion"],
        "startTime" => 152378,
        "endTime" => 154350
    ], [
        "text" => $art["aperture"],
        "startTime" => 154350,
        "endTime" => 180000
    ]
];

echo(json_encode($timeline));

?>