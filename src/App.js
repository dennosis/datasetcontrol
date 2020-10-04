import React, { useState, useEffect } from 'react';
import { useParams } from "react-router";
import { useHistory } from "react-router-dom";

import { Container } from 'reactstrap';
import api from './api'

import { Control } from './Control.js'
import { descriptionObj, saveModel, setModelSvgDOM, validatePositiveNumber } from './utils.js'


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
    const [saveAllMode, setSaveAllMode] = useState(false);

    const [color, setColor] = useState(true);
    const [furniture, setFurniture] = useState(false);
    const [openings, setOpenings] = useState(false);
    const [segmentation, setSegmentation] = useState(false);
    const [saveApi, setSaveApi] = useState(true);
    const [saveImg, setSaveImg] = useState(false);
    
    let style = []

    if (color) style.push('color')
    if (!furniture) style.push('furniture')
    if (!openings) style.push('openings')
    if (segmentation) style.push('segmentation')

    const saveAllModel=()=>{
        setSaving(false)
        setSaveAllMode(true)
    }

    const updateUrl = (indexModel=0, maxIndexModel=1) => {
        if(indexModel < maxIndexModel){
            setIndex(indexModel)
            history.replace(`/${indexModel+1}`)
        }else{
            setIndex(maxIndexModel-1)
            history.replace(`/${maxIndexModel}`)
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
                if(saveAllMode && !saving){
                    if(index < models.length){
                        setSaving(true)
                        saveModel(descriptionObj(description.path),                   
                            saveApi,
                            saveImg,
                            ()=>{
                                return setTimeout(()=>{    //dispara depois de 1.0 segundos
                                    const newIndex = index+1
                                    if(newIndex === models.length){
                                        setSaveAllMode(false)
                                    } else {
                                        setDescriptionIsError(false)
                                        updateUrl(newIndex, models.length)
                                    }
                                    setSaving(false)
                                }, 1000)
                            }
                        )
                        
                    }else{
                        setSaveAllMode(false)
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
        saveAllMode, 
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
                    setIndex={(index)=>{updateUrl(index, models.length); setDescriptionIsError(false); }}
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

                    saveModel={() => {
                        const descriptionUpdated = descriptionObj(description.path, description.isValid)
                        saveModel(descriptionUpdated,saveApi,saveImg)
                        setDescription({...description,...descriptionUpdated})
                    }}

                    saveAllModel={()=>saveAllModel()}

                />
                { 
                    description &&
                    <section className="p-3">
                        <h2>name: {description.name}</h2>
                        <h3>dimensions: {`${description.width}m x ${description.height}m`}</h3>
                    </section>
                }
                <div className="d-flex">
                    {
                        description &&
                        <section className="p-3" style={{ minWidth: '500px' }}>
                            {
                                description.spaces &&
                                description.spaces.map((space, index) => (
                                    <h6 key={index} className="d-flex align-items-end">
                                        <svg viewBox="0 0 20 20" className="mr-1" style={{ width: '20px', height: '20px' }} ><g className={`${(space.class).replaceAll('.', ' ')}`} stroke="#000000" style={{ fillOpacity: 1, strokeWidth: 2, strokeOpacity: 1 }}><rect x="0" y="0" width="100%" height="100%" /></g></svg>
                                        {`${space.name}_${space.index}: area(${space.area}m²) max(${space.width}m x ${space.height}m) pos(${space.horizontally},${space.vertically})`}
                                    </h6>
                                ))
                            }
                        </section>
                    }
                    <section id="model" className="p-5">
                        <div id="plain">

                        </div>
                    </section>
                </div>
            </Container>

        );
}

export default App;