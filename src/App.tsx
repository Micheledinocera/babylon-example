import { FC, useCallback, useMemo, useRef, useState } from 'react';

import { Scene, Engine, SceneEventArgs } from 'react-babylonjs';
import { KeyboardEventTypes, KeyboardInfo, Mesh, UniversalCamera,Vector3,Scene as BabylonScene, Color3 } from '@babylonjs/core';

import Shape from './components/Shape' 
import './App.sass';
import { SHAPES, startPosition } from './utils/Utils';


const App: FC = () => {
  const [selectedShape,setSelectedShape] = useState<Mesh>()
  const [selectedIndex,setSelectedIndex] = useState<number>(-1)
  const [moved,setMoved] = useState<boolean>(false)
  const [sceneRef,setSceneRef] = useState<BabylonScene>()
  const cameraRef = useRef<UniversalCamera>(null);

  const onSelectShape=(clickedShape:Mesh,index:number)=>{
    setSelectedShape((value)=>{
      setMoved(false)
      if(value?.id===clickedShape.id){
        setSelectedIndex(-1)
        return undefined
      } 
      //FORCED REFRESH
      setSelectedIndex(-1)
      setTimeout(()=>setSelectedIndex(index),100)
      return clickedShape
    })
  }

  const resetCameraPosition=useCallback(()=>{
    if(cameraRef.current){
      cameraRef.current.position=new Vector3(0,4,14);
      cameraRef.current.target=new Vector3(0,0,-20);
    }
  },[cameraRef])

  const resetObjectsPosition=useCallback(()=>{
    let mesh;
    SHAPES.forEach((shape,index)=>{
      mesh = sceneRef?.getMeshById(shape.type+"_"+index);
      if(mesh)
        mesh.position=startPosition(index)
    })
  },[sceneRef])

  const resetObjectsAndCamera=()=>{
    resetCameraPosition();
    resetObjectsPosition();
  }

  const onSceneMount=(sceneEventArgs:SceneEventArgs)=>{
    setSceneRef(sceneEventArgs.scene)
  }

  const showButton=useMemo(()=>{
    return selectedShape && moved
  },[selectedShape, moved])

  const resetPosition=useCallback(()=>{
    if(selectedShape){
      setMoved(false)
      selectedShape.position=startPosition(selectedIndex)
    }
  },[selectedShape,selectedIndex,setMoved])

  const onKeyboardObservable=useCallback((kbInfo: KeyboardInfo)=>{
    if(selectedShape){
      let localShapeRef=selectedShape;
      switch (kbInfo.type) {
        case KeyboardEventTypes.KEYDOWN:
          switch (kbInfo.event.key) {
            case 'w':
              localShapeRef.position.y += 1;
              setMoved(true)
              break;
            case 's':
              localShapeRef.position.y -= 1;
              setMoved(true)
              break;
            case 'a':
              localShapeRef.position.x += 1;
              setMoved(true)
              break;
            case 'd':
              localShapeRef.position.x -= 1;
              setMoved(true)
              break;
            case 'Backspace':
              resetPosition();
              break;
        }
        break;
      }
      setSelectedShape(()=>localShapeRef)
    }
  },[selectedShape,setSelectedShape,resetPosition])

  return (
    <div className="App">
      <header className="App-header">
        <div className="title"> @babylonjs + `react-babylonjs` </div>
        {selectedShape?<div className="value"> Selected shape {selectedShape.id} </div>:null}
        <button onClick={resetCameraPosition}> Reset Camera Position</button>
        <button onClick={resetObjectsPosition}> Reset Objects Position</button>
        <button onClick={resetObjectsAndCamera}> Reset Objects and Camera Position</button>
        <Engine antialias adaptToDeviceRatio canvasId="sample-canvas">
          <Scene onKeyboardObservable={onKeyboardObservable} onSceneMount={onSceneMount}>
            <hemisphericLight name='hemi' direction={Vector3.Up()} />
            <universalCamera ref={cameraRef} name="camera" position={new Vector3(0,4,14)} target={new Vector3(0,0,-20)}/*  onViewMatrixChangedObservable={onCameraViewChange} *//>
            {SHAPES.map((shape,index)=>
              <Shape shape={shape} shapeIndex={index} key={shape.type+"_"+index} onSelectShape={onSelectShape} selectedShape={selectedShape}></Shape>
            )}
            {selectedIndex>=0 &&
              <ground name='background' position={new Vector3(0,4,0)} rotation={new Vector3(Math.PI/2,0,0)} width={6} height={6}>
                  <standardMaterial name='background_material'>
                    <texture name='background_texture' url={SHAPES[selectedIndex].img}/>
                  </standardMaterial>
              </ground>
            }
            {showButton && <plane
              name="dialog"
              width={1}
              height={1}
              position={new Vector3(4,4,0)}
              rotation={new Vector3(0, Math.PI, 0)}>
                <advancedDynamicTexture
                  name="dialogTexture"
                  height={400}
                  width={200}
                  createForParentMesh
                  generateMipMaps={true}
                >
                  <babylon-button 
                  paddingLeft="0"
                  paddingRight="0"
                  width="280px"
                  height="140px"
                  background={Color3.Green().toHexString()}
                  onPointerDownObservable={resetPosition} > 
                    <textBlock 
                    fontSize={30}
                    color="white"
                    text="reset position"/>
                  </babylon-button>
                </advancedDynamicTexture>
              </plane>
            }
          </Scene>
        </Engine>
      </header>
    </div>
  );
}

export default App;