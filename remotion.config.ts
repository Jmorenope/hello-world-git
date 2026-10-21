import {Config} from '@remotion/cli/config';

// Calidad alta: cada fotograma se captura casi sin pérdida y el MP4 final se
// comprime con poca pérdida. Instagram recomprime al subir, así que conviene
// entregarle el archivo con la mejor calidad posible.
Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(100);
Config.setCrf(15);
Config.setX264Preset('slow');
Config.setColorSpace('bt709');
Config.setOverwriteOutput(true);
