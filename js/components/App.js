import React, {useState, useEffect} from 'react';
import axios from 'axios';
import DisplaySensorStatus from "./display/DisplaySensorStatus";
import DisplaySensorsThatHaveNeverRun from "./display/DisplaySensorsThatHaveNeverRun";

export const App = () => {
    const [data, setData] = useState("");
    const [newSensors, setNewSensors] = useState("");

    useEffect(() => {
        var config = require('../../config');

        axios.get(config["base-url"] + '/checkResults').then(res => {

            res.data.sort(sortOnNameFunction);

            function sortOnNameFunction(a, b) {
                if (a.check.name === b.check.name) {
                    return 0;
                }
                else {
                    return (a.check.name< b.check.name) ? -1 : 1;
                }
            }

            res.data.sort(sortOnStatusFunction);

            function sortOnStatusFunction(a, b) {
                if (a.check.status === b.check.status) {
                    return 0;
                }
                else {
                    return (a.check.status > b.check.status) ? -1 : 1;
                }
            }
            setData(res.data);
        }).catch(e=>{
            console.log(e);
        });

        axios.get(config["base-url"] + '/newSensors').then(res => {
            setNewSensors(res.data);
        }).catch(e=>{
            console.log(e);
        });
    }, []);

    return (
        <div>
            <DisplaySensorsThatHaveNeverRun data={newSensors} />
            <DisplaySensorStatus data={data} />
        </div>
    )
}
