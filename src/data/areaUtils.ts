import chinaAreaData from "./chinaAreaData202001.js";
const areaData = chinaAreaData();

interface AreaOption {
    value: string,
    label: string
}

export function getLabels(
    province?: string,
    city?: string,
    area?: string,
    street?: string,
): string[] {
    const labels: string[] = [];
    if(province) {
        labels.push(areaData['86'][province]);
    }
    if(city) {
        labels.push(areaData[province!][city]);
    }
    if(area) {
        labels.push(areaData[city!][area]);
    }
    if(street) {
        labels.push(areaData[area!][street]);
    }
    return labels;
}
