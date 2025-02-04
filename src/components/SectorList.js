import { useState } from "react";

const SectorList = (params) => {

    const mode = params.mode;



    const [newSector, setNewSector] = useState({name: "", color: "#000000"});
    const sectors = params.sectors;
    const setSectors = params.setSectors;

    const selectedColor = params.selectedColor;
    const setSelectedColor = params.setSelectedColor;
    //const [sectors, setSectors] = useState([]);

    const addNewSector = () => {

        if (mode === "assign"){
            const newS = {name: newSector.name, color: newSector.color};
            if (!sectors.some(item => item.name === newSector.name)){
                setSectors((prev) => [...prev, 
                    newS
                ]);
                setNewSector((prev) => ({ ...prev, name: '' }))
            };
        };
        
    };


    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <td>Цвет</td>
                        <td>Факультет</td>
                    </tr>
                </thead>
                <tbody>
                    {sectors.map((row, index) => (
                        <tr key={index} >
                            <td style={{backgroundColor: row.color}}></td>
                            <td
                                style={{fontWeight : (row.color === selectedColor?"bold":"normal")}}
                                onClick={() => setSelectedColor(row.color)}    
                            >
                                {row.name}
                            </td>
                        </tr>
                    ))}
                    <tr>
                        <td>
                            <input
                            type="color"
                            onChange={(e) =>
                            setNewSector((prev) => ({ ...prev, color: e.target.value }))
                            }
                            /> 
                        </td>
                        <td>
                            <input
                            type="text"
                            value={newSector.name}
                            onChange={(e) =>
                            setNewSector((prev) => ({ ...prev, name: e.target.value }))
                            }
                            />
                        </td>
                        <td>
                        <button onClick={addNewSector} disabled={!newSector.name}>
                            Подтвердить
                        </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

    );


};

export default SectorList;