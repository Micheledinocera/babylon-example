import { Vector3 } from "@babylonjs/core";

export type ShapeObj = {
    type: 'sphere'|'square',
    img: string
}

export const BABYLON_TEXTURE_ASSETS_URL="https://assets.babylonjs.com/textures/";

export const SHAPES : ShapeObj[] =[{
        type:'sphere',
        img:BABYLON_TEXTURE_ASSETS_URL+'albedo.png'
    },{
        type:'square',
        img:BABYLON_TEXTURE_ASSETS_URL+'bloc.jpg'
    },{
        type:'sphere',
        img:BABYLON_TEXTURE_ASSETS_URL+'floor.png'
    },{
        type:'square',
        img:BABYLON_TEXTURE_ASSETS_URL+'crate.png'
    },{
        type:'square',
        img:BABYLON_TEXTURE_ASSETS_URL+'lava/lavatile.jpg'
}]

export const startPosition=(index:number)=>{
    let scaleFactor=(index+1)
    if(index%2)
        scaleFactor*=-1
    return Vector3.Right().scale(scaleFactor)
}