import { put } from "axios";
import createApp from "ringcentral-chatbot/dist/apps";
import getData from "./api/covid";

let county = [];

const handle = async (event) => {
  let covid = [];
  const { type, text, group, bot } = event;

  if (typeof text !== "undefined") {
    let split = text.split(" ");

    if (split.length === 2) {
      let info = split[1].split("-");
      console.log("INFOR ARRAY: ");
      county.push(split[0]);
      county.push(info[0]);
      county.push(info[1]);
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
        },
      ],
      text:
        "This bot was made by Jackson Melcher using data from the [New York Times](https://www.nytimes.com/interactive/2020/us/coronavirus-us-cases.html), the code can be found [here](https://github.com/jacksonmelcher/COVID19-bot)",
    });
  }
  if (type === "Message4Bot" && text === "help") {
    await bot.sendMessage(group.id, {
      text:
        "This bot will tell you how many cases of COVID-19 there are in your state/county.\n\n" +
        "To use the bot type 'stats' followed by the name of your county and State. Ex: **'stats washoe-nevada'**\n" +
        "Please **don't** add extra spaces between the county-state.\n\n" +
        "If you have any issues or suggestions please open an issue [here](https://github.com/jacksonmelcher/COVID19-bot/issues)",
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
