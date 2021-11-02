import {Presets, SingleBar,} from "cli-progress";

export function refBar(name) {
    return new SingleBar(
        {
            stopOnComplete: true,
            format: `${name} | ` + '{bar}' + '|| {percentage}% |' +
                '{value}/{total} | {eta}s left | duration: {duration}s'
        },
        Presets.shades_classic
    )
}
