import React, { useState, useEffect } from 'react';
import { useParams } from "react-router";
import { useHistory } from "react-router-dom";

import { Container } from 'reactstrap';
import api from './api'

import { Control } from './Control.js'
import { descriptionObj, saveModel, setModelSvgDOM, validatePositiveNumber, scrollElement, spaceSelection, mouseDownModel, classesSpace, updateClassSpace } from './utils.js'


function App() {
   
    const history = useHistory()
    const { modelNumberRoute } = useParams()

    const [index, setIndex] = useState(0);
    
    const [models, setModels] = useState([]);
    const [modelsError, setModelsError] = useState(false);

    const [description, setDescription] = useState({});
    const [descriptionIsError, setDescriptionIsError] = useState(false);
    const [descriptionIsFinding, setDescriptionIsFinding] = useState(false);

    const [saving, setSaving] = useState(false);
    const [saveAllModels, setSaveAllModels] = useState(false);

    const [color, setColor] = useState(true);
    const [furniture, setFurniture] = useState(true);
    const [openings, setOpenings] = useState(true);
    const [segmentation, setSegmentation] = useState(false);
    const [saveApi, setSaveApi] = useState(true);
    const [saveImg, setSaveImg] = useState(false);
    
    const [updateSpace, setUpdateSpace] = useState({});


    let style = []

    if (color) style.push('color')
    if (!furniture) style.push('furniture')
    if (!openings) style.push('openings')
    if (segmentation) style.push('segmentation')


    const updateUrl = (indexModel=0, maxIndexModel=1) => {
        if(indexModel < maxIndexModel){
            setIndex(indexModel)
            history.replace(`/${indexModel+1}`)
        }else{
            setIndex(maxIndexModel-1)
            history.replace(`/${maxIndexModel}`)
        }
    }

    const saveModelAndSVG = async() => {
        if(!saveAllModels && !saving){
            await setSaving(true)
            const descriptionUpdated = await descriptionObj(description.path, description.isValid)
            await saveModel(descriptionUpdated,saveApi,saveImg)
            await setDescription({...description,...descriptionUpdated})
            await setSaving(false)

        }
    }

    useEffect(() => {
        
        if (!models.length && !modelsError) {
            api.getPlains().then(
                res => {
                    setModels(res.data)
                    updateUrl((validatePositiveNumber(modelNumberRoute)-1), res.data.length)
                },
                error => {
                    setModelsError(true)
                }
            )
        }
        
        if(models.length){
            if (!descriptionIsError && (description._id !== models[index]._id)) {
                if(!descriptionIsFinding){
                    setDescriptionIsFinding(true)
                    api.getPlainById(models[index]._id)
                        .then(
                            res => {
                                setDescription({...res.data})
                                setModelSvgDOM(res.data.svg)
                            },
                            error => {
                                setDescription({})
                                setDescriptionIsError(true)
                            }
                        )
                        .finally(()=>setDescriptionIsFinding(false))
                }
                
            }else{
                if(saveAllModels && !saving){
                    if(index < models.length){
                        setSaving(true)
                        saveModel(descriptionObj(description.path),                   
                            saveApi,
                            saveImg,
                            ()=>{
                                return setTimeout(()=>{    //dispara depois de 1.0 segundos
                                    const newIndex = index+1
                                    if(newIndex === models.length){
                                        setSaveAllModels(false)
                                    } else {
                                        setDescriptionIsError(false)
                                        updateUrl(newIndex, models.length)
                                    }
                                    setSaving(false)
                                }, 1000)
                            }
                        )
                        
                    }else{
                        setSaveAllModels(false)
                    }
                }    
            }
        }



    }, [
        index, 
        models, 
        modelsError,
        description, 
        descriptionIsError, 
        descriptionIsFinding, 
        saveAllModels, 
        saving, 
        saveApi, 
        saveImg
    ]);


    if(!description.name)
        return null
    else
        return (
            <Container className={style.join(' ')}>
                <Control
                    index={index}
                    setIndex={(index)=>{
                        updateUrl(index, models.length); 
                        setDescriptionIsError(false); 
                    }}
                    length={models.length}

                    color={color}
                    setColor={setColor}
                    furniture={furniture}
                    setFurniture={setFurniture}
                    openings={openings}
                    setOpenings={setOpenings}
                    segmentation={segmentation}
                    setSegmentation={setSegmentation}
                    saveApi = {saveApi}
                    setSaveApi = {setSaveApi}
                    saveImg = {saveImg} 
                    setSaveImg = {setSaveImg}

                    setIsValid={(isValid)=>setDescription({...description, isValid})}
                    isValid={description.isValid}

                    saveAllModels={saveAllModels}
                    setSaveAllModels={(saveAllModelsIn)=>{
                        setSaving(false)
                        setSaveAllModels(saveAllModelsIn)
                    }}

                    saveModel={saveModelAndSVG}

                />
                <div className="description pb-5 d-flex flex-column align-items-start">
                    { 
                        description &&
                        <section className="p-3">
                            <h2>name: {description.name}</h2>
                            <h3>dimensions: {`${description.width}m x ${description.height}m`}</h3>
                        </section>
                    }
                        {
                            description &&
                            <section onMouseOut={()=>{spaceSelection(); setUpdateSpace({})}} className="description__spaces p-3 pb-5 d-flex flex-column align-items-start" style={{ minWidth: '100px' }}>
                                {
                                    description.spaces &&
                                    description.spaces.map((space, index) => {

                                    
                                        if(updateSpace.name===space.name && updateSpace.index===space.index){
                                            return (
                                                <select 
                                                    key={index}
                                                    className="my-1 mr-sm-2 custom-select"
                                                    onChange={async (e)=>{
                                                        await updateClassSpace(space.class,space.index,e.target.value)
                                                        await saveModelAndSVG()
                                                        await setUpdateSpace({})
                                                    }}
                                                    value={space.class.replace('.Space.', 'Space ')}
                                                > 
                                                    {
                                                        classesSpace().map((classSpace, ind)=><option key={ind} value={classSpace} >{classSpace}</option>)
                                                    }
                                                </select>
                                            )
                                        }else{
                                            return (
                                                <h6 key={index} onDoubleClick={()=>setUpdateSpace({name:space.name, index:space.index})} className="d-flex align-items-end" onMouseOver={()=>spaceSelection(space.class, space.index, true)} onClick={()=>{scrollElement(space.class, space.index)}} >
                                                    <svg viewBox="0 0 20 20" className="mr-1" style={{ width: '20px', height: '20px' }} ><g className={`${(space.class).replaceAll('.', ' ')}`} stroke="#000000" style={{ fillOpacity: 1, strokeWidth: 2, strokeOpacity: 1 }}><rect x="0" y="0" width="100%" height="100%" /></g></svg>
                                                    <span>{`${space.name}_${space.index}: area(${space.area}m²) max(${space.width}m x ${space.height}m) pos(${space.horizontally},${space.vertically})`}</span>
                                                </h6>
                                            )
                                        }
                                    })
                                }
                            </section>
                        }
                </div>
                <div className="d-flex">
                    <section id="model" onMouseDown={(e)=>mouseDownModel(e)} className="p-5">
                        <div id="plain">
                        </div>
                    </section>
                </div>
                { 
                    (descriptionIsFinding || saving) &&
                    <div className="loader-container">
                        <div className="loader"></div>
                    </div>
                }

            </Container>

        );
}

export default App;