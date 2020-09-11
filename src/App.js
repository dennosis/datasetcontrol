import React,{useState} from 'react';
import { Control } from './Control.js'
import { models }  from './importsSVG.js'


function App() {

  const [ index, setIndex ] = useState(0);
  const [ colorStyle, setColorStyle ] = useState(true);

  const { Model, path }  =  models[index]

  return (
    <section className={colorStyle?'app':''}>

      <Control 
        index={index} 
        setIndex={setIndex} 
        length={models.length} 
        path={path} 
        colorStyle={colorStyle}
        setColorStyle={setColorStyle}
      />
      
      <section id="model" className="m-5">
        <Model />
      </section>

    </section>

  );
}

export default App;



/*

const ModelSVG = ({ name, ...rest }) => {
  const ImportedIconRef =  React.useRef();
  const [loading, setLoading] = React.useState(false);
  React.useEffect(() => {
    setLoading(true);
    const importIcon = async () => {
      try {
        // Changing this line works fine to me
        ImportedIconRef.current = (await import(`!!@svgr/webpack?-svgo,+titleProp,+ref!./datasets/cubicasa5k/colorful/30/model.svg`)).default;
      } catch (err) {
        throw err;
      } finally {
        setLoading(false);
      }
    };
    importIcon();
  }, [name]);

  if (!loading && ImportedIconRef.current) {
    const { current: ImportedIcon } = ImportedIconRef;
    return <ImportedIcon {...rest} />;
  }
  return null;
};

*/