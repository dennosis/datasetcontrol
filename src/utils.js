import {polygonArea} from 'd3-polygon'
import api from './api'

import domtoimage from 'dom-to-image';
import saveAs from 'file-saver';

const spacesClasses = [
    '.Space.Room',
    '.Space.Bath',
    '.Space.Entry',
    '.Space.LivingRoom',
    '.Space.Bedroom',
    '.Space.Kitchen',
    '.Space.Garage',
    '.Space.Storage',
    '.Space.Outdoor',
    '.Space.UserDefined',
    '.Space.DraughtLobby',
    '.Space.Alcove',
    '.Space.Utility.Laundry',
    '.Space.Dining',
    '.Space.Closet.WalkIn',
    '.Space.TechnicalRoom',
    '.Space.Fireplace',
    '.Space.DressingRoom',
    '.Space.Sauna',
    '.Space.Office',
    '.Space.RecreationRoom',
    '.Space.Bar',
    '.Space.Library',
    '.Space.CarPort',
    '.Space.Undefined',
]

export const descriptionObj = (path, isValid) => {
    const elementPlain = document.getElementsByClassName('Model')[0]

    if(elementPlain){
        const {offsetWidth,offsetHeight} = document.getElementById('plain')
        const svg = document.getElementById('temp').outerHTML
        const pathItems = path.split('/')
        const { width, height, x, y } = elementPlain.getBBox()
        const model = {
            width: Math.ceil(Math.abs(width/100)), 
            height: Math.ceil(Math.abs(height/100)),
            width_px: Math.ceil(width), 
            height_px: Math.ceil(height),
            imgX_px:Math.ceil(x),
            imgY_px:Math.ceil(y),
            imgWidth_px: Math.ceil(offsetWidth),
            imgHeight_px: Math.ceil(offsetHeight),
        }

        const spaces = getSpaces(model) || []


        let isValidCheck
        //if(isValid===undefined)
            if(spaces.filter((space)=>space.name.includes('undefined')).length > 2)
                isValidCheck = false
            else
                isValidCheck = true
        //else
        //    isValidCheck = isValid


        const description = {
            name:(`${pathItems[2]}_${pathItems[3]}`).toLowerCase(),
            path,
            spaces,
            width: model.width, 
            height: model.height,
            width_px: model.width_px, 
            height_px: model.height_px,
            imgX_px: model.imgX_px,
            imgY_px: model.imgY_px,
            imgWidth_px: model.imgWidth_px,
            imgHeight_px: model.imgHeight_px,
            isValid: isValidCheck,
            svg: btoa(svg)
        }
        return description

    }
    return undefined
}

const getSpaces = (model) => {
    const spaces = spacesClasses.reduce((acumulador, valorAtual)=>{
        const spacePolygon  = document.querySelectorAll(`#plain ${valorAtual} > polygon`)
        if(spacePolygon.length){
            spacePolygon.forEach((item, index)=>{
                const {area, width, height} = calcArea(item)
                const {rcx, rcy, horizontally, vertically} = calcPosition(item, model)
                acumulador.push({
                    class: valorAtual,   
                    name: (`${valorAtual.replace('.Space.', '')}`).toLowerCase(),
                    index, 
                    rcx, 
                    rcy, 
                    horizontally, 
                    vertically,
                    area,
                    width,
                    height
                })
            })
        }
        return acumulador
    }, []);

    return spaces.filter(space=>space.horizontally !== undefined && space.vertically !== undefined)
}

const calcArea = (polygon) => {
    const points = []
    for(let i=0; i < polygon.points.length; i++){
        const {x, y} = polygon.points.getItem(i)
        points.push([x, y])
    }
    //dimensões arredondadas
    return {
        area: Math.ceil(Math.abs(polygonArea(points)/10000)),
        width: Math.ceil(polygon.getBBox().width/100),
        height: Math.ceil(polygon.getBBox().height/100)
    }
}

const calcPosition = (polygon, model) => {

    const {x,y,width,height} = polygon.getBBox()
    const rcx = Math.ceil((x-model.imgX_px + width / 2) / 10) / 10
    const rcy = Math.ceil((y-model.imgY_px + height / 2) / 10) / 10
    const { horizontally , vertically } = getSegmentPosition(model.width, model.height, rcx, rcy)
    return {
        rcx,
        rcy,
        horizontally,
        vertically
    }
}

const getSegmentPosition=(width,height,rPosX,rPosY)=>{
    const horizontally = ['left', 'center', 'right']
    const vertically = ['top', 'center', 'bottom']
    const unitSegmentWidth = Math.ceil(width / horizontally.length)
    const unitSegmentHeight = Math.ceil(height / vertically.length)

    let segmentHorizontally = undefined
    let segmentVertically = undefined

    if(unitSegmentWidth && rPosX){
        if(rPosX >= 0 && rPosX <= unitSegmentWidth)
            segmentHorizontally = horizontally[0]
        else if(rPosX <= unitSegmentWidth * 2 )
            segmentHorizontally = horizontally[1]
        else if(rPosX <= unitSegmentWidth * 3)
            segmentHorizontally = horizontally[2]
    }

    if(unitSegmentHeight && rPosY){
        if(rPosY >= 0 && rPosY <= unitSegmentHeight)
            segmentVertically = vertically[0]
        else if(rPosY <= unitSegmentHeight * 2 )
            segmentVertically = vertically[1]
        else if(rPosY <= unitSegmentHeight * 3)
            segmentVertically = vertically[2]
    }

    return {
        horizontally: segmentHorizontally, 
        vertically: segmentVertically
    }

}

export const setModelSvgDOM=(modelSvg)=>{
    if(modelSvg)
        document.getElementById("plain").innerHTML = atob(modelSvg);
}

export const saveModel=async(descriptionObj,saveApi,saveImg,afterSave)=>{

    if(saveApi && descriptionObj){
        await api.storePlain(descriptionObj)
    }
    if(saveImg){        
        await domtoimage.toBlob(document.getElementById('plain'))
        .then(async (blob)=>{
            const name = descriptionObj ? descriptionObj.name : ""
            await saveAs(blob, `${name}.png`);
        })
    }
    
    if(afterSave)
        await afterSave()
}

export const validatePositiveNumber = (inputNumber) =>{
    const checkedNumber = Number(inputNumber)
    if(checkedNumber && checkedNumber >= 0)
        return checkedNumber
    else
        return 0
}
