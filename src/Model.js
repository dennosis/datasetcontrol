import React, { useState, useEffect, useRef } from 'react';


export const ModelSVG = ({svgHref} ) => {
  const ImportedSvgRef = useRef(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const importSvg = async () => {
      try {
        ImportedSvgRef.current =  (await import(`!!@svgr/webpack?-svgo,+titleProp,+ref!./${svgHref}.svg`)).default
      } catch (err) {
        throw err;
      } finally {
        setLoading(false);
      }
    };
    importSvg();
  });

  if (!loading && ImportedSvgRef.current) {
    const { current: ImportedSvg } = ImportedSvgRef;
    return <ImportedSvg />;
  }

  return null;
};
     

