import { put } from "axios";
import createApp from "ringcentral-chatbot/dist/apps";
import getData from "./api/covid";

let county = [];

const handle = async (event) => {
  let covid = [];
  const { type, text, group, bot } = event;

  if (typeof text !== "undefined") {
    let split = text.split("-");
    if (split.length == 3) {
      county.push(split[0]);
      county.push(split[1]);
      county.push(split[2]);
      console.log("Command: " + county[0]);
      console.log("County: " + county[1]);
      console.log("State: " + county[2]);
    }
  }

  covid = await getData(county[1], county[2]);

  if (type === "Message4Bot" && county[0] === "stats") {
    await bot.sendMessage(group.id, {
      attachments: [
        {
          type: "Card",
          text: `Covid Cases for **${covid[0].county} County**  in **${
            covid[0].state
          }**: \n\n ${covid
            .map(
              (data) =>
                `Cases:\t \t \t \t **${data.cases}** - Date:\t **${data.date}**`
            )
            .join("\n")}`,
          footnote: {
            text:
              "This bot was made by Jackson Melcher using data from the New York times, the code can be found [here](https://github.com/jacksonmelcher/COVID19-bot)",
          },
        },
      ],
    });
  }
  if (type === "Message4Bot" && text === "graph") {
    await bot.sendMessage(group.id, {
      text: "Chart",
      attachments: [
        {
          //   id: \"66592778",
          name: "parrot.png",
          contentUri: "https://nivo-api.herokuapp.com/samples/line.svg",
        },
      ],
    });
  }
  county = [];
};

const app = createApp(handle);
app.listen(process.env.RINGCENTRAL_CHATBOT_EXPRESS_PORT);

setInterval(
  async () =>
    put(`${process.env.RINGCENTRAL_CHATBOT_SERVER}/admin/maintain`, undefined, {
      auth: {
        username: process.env.RINGCENTRAL_CHATBOT_ADMIN_USERNAME,
        password: process.env.RINGCENTRAL_CHATBOT_ADMIN_PASSWORD,
      },
    }),
  24 * 60 * 60 * 1000
);
