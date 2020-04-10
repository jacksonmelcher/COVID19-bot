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

const toJSON = async (county, state) => {
  let formattedData;
  let countyData = [];
  let paramBool = [];
  await getData();
  console.log(`to JSON: ${county} --- ${state}`);
  if (typeof county !== "undefined" && typeof state !== "undefined") {
    paramBool.push(county);
    paramBool.push(state);
    console.log(`OBJECTS IN PARAM ARRAY: ${paramBool[0]} -- ${paramBool[1]}`);

    try {
      formattedData = await CSVToJSON()
        .fromFile("./cases.csv")
        .then((source) => {
          for (let i = 0; i < source.length; i++) {
            // Check to see if both parameters canme it
            if (
              source[i].county.toUpperCase() === paramBool[0].toUpperCase() &&
              source[i].state.toUpperCase() === paramBool[1].toUpperCase()
            ) {
              countyData.push(source[i]);
            }
          }
          if (countyData.length === 0) {
            countyData.push("No Data");
          }
          return countyData;
        });
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log("County is undefined");
  }

  return formattedData;
};

export default toJSON;
