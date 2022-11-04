<?php

namespace SensuDashboard\Service;

use DirectoryIterator;
use Exception;

class SensuConfigService
{
    private $sensuConfigDirectory;

    /**
     * @param $sensuConfigDirectory
     */
    public function __construct($sensuConfigDirectory)
    {
        $this->sensuConfigDirectory = $sensuConfigDirectory;
    }

    public function getCurrentConfiguredSensors()
    {
        $directoryIterator = new DirectoryIterator($this->sensuConfigDirectory);

        $sensuConfig = [];
        foreach ($directoryIterator as $file) {
            if ($file->isDir()) {
                $innerIterator = new DirectoryIterator($file->getPathname());
                foreach ($innerIterator as $file) {
                    if ($file->isDot() || $file->getExtension() != 'json') {
                        continue;
                    }

                    $sensuConfig[] = json_decode(file_get_contents($file->getPathname()), 1);
                }
            } else {
                if ($file->isDot() || $file->getExtension() != 'json') {
                    continue;
                }

                $sensuConfig[] = json_decode(file_get_contents($file->getPathname()), 1);
            }
        }

        if (empty($sensuConfig)) {
            throw new Exception('No Sensor config data found');
        }

        return $sensuConfig;
    }
}
