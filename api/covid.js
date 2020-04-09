import { get } from "axios";
import CSVToJSON from "csvtojson";
import { writeFile } from "fs";

const getData = async () => {
  let response;
  try {
    response = await get(
      "https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-counties.csv"
    );

    writeFile("cases.csv", response.data, (error) => {
      // In case of a error throw err exception.
      if (error) throw err;
    });
  } catch (error) {
    console.log(error);
    return;
  }

  return response;
};

const toJSON = async (county) => {
  let formattedData;
  let countyData = [];
  let paramBool = [];
  await getData();

  if (typeof county !== "undefined") {
    paramBool.push(county);
    console.log("IN JSON function:" + paramBool[0]);
    try {
      formattedData = await CSVToJSON()
        .fromFile("./cases.csv")
        .then((source) => {
          for (let i = 0; i < source.length; i++) {
            if (source[i].county.toUpperCase() === paramBool[0].toUpperCase()) {
              countyData.push(source[i]);
            }
          }
          return countyData;
        });
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log("Some sort of error happened");
  }

  return formattedData;
};

export default toJSON;
