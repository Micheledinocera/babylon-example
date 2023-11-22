import { Color3, HighlightLayer, Mesh, Vector3 } from '@babylonjs/core';
import { FC, useEffect, useMemo, useRef } from 'react';
import { useClick } from 'react-babylonjs';
import { startPosition } from '../utils/Utils';
import { ShapeObj } from '../utils/Utils';

type ShapeProps = {
    shape: ShapeObj,
    shapeIndex:number,
    selectedShape:Mesh|undefined,
    onSelectShape(shapeRef:Mesh|null,index:number): void
}

const Shape: FC<ShapeProps> = ({shape,shapeIndex,selectedShape,onSelectShape}) => {
    const shapeRef = useRef<Mesh>(null);
    const highlightLayerEL = useRef<HighlightLayer | null>(null)
    
    const shapePosition: Vector3= useMemo(()=>{
        return startPosition(shapeIndex)
    },[shapeIndex])

    const isSelected=useMemo(()=> 
        selectedShape?.id===shape.type+"_"+shapeIndex
    ,[selectedShape,shape,shapeIndex])

    useClick(_ => {
        onSelectShape(shapeRef.current,shapeIndex)
    },shapeRef);
    
    useEffect(() => {
        if (highlightLayerEL.current && shapeRef.current && isSelected) {
          highlightLayerEL.current.addMesh(shapeRef.current, Color3.Green())
        } else if(highlightLayerEL.current && shapeRef.current){
            highlightLayerEL.current.removeMesh(shapeRef.current)
        }
    }, [shapeRef, highlightLayerEL, isSelected])

    return <>
        {shape.type==="sphere"?
        <sphere ref={shapeRef} name={shape.type+"_"+shapeIndex} position={shapePosition} id={shape.type+"_"+shapeIndex} >
            <standardMaterial name={'mat'+shape.type+"_"+shapeIndex} diffuseColor={Color3.White()}> 
                <texture name='background_texture' url={shape.img}/>
            </standardMaterial>
        </sphere>:
        <box ref={shapeRef} name={shape.type+"_"+shapeIndex} position={shapePosition} id={shape.type+"_"+shapeIndex}>
            <standardMaterial name={'mat'+shape.type+"_"+shapeIndex} diffuseColor={Color3.White()}>
                <texture name='background_texture' url={shape.img}/>
            </standardMaterial>
        </box>} 
        <highlightLayer name="hl" ref={highlightLayerEL} />
    </>
}

export default Shape;