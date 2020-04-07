import { get } from 'axios';
import CSVToJSON from 'csvtojson';
import { writeFile } from 'fs';

const getData = async () => {
    let response;
    try {
        response = await get(
            'https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-counties.csv'
        );

        writeFile('cases.csv', response.data, (error) => {
            // In case of a error throw err exception.
            if (error) throw err;
        });
    } catch (error) {
        console.log(error);
        return;
    }

    return response;
};

const toJSON = async () => {
    let formattedData;
    let countyData = [];
    await getData();
    try {
        formattedData = await CSVToJSON()
            .fromFile('./cases.csv')
            .then((source) => {
                for (let i = 0; i < source.length; i++) {
                    if (source[i].county === 'Washoe') {
                        countyData.push(source[i]);
                    }
                }
                return countyData;
            });
    } catch (error) {
        console.log(error);
    }

    return formattedData;
};

export default toJSON;
