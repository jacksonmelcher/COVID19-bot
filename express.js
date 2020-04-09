import { put } from "axios";
import createApp from "ringcentral-chatbot/dist/apps";
import getData from "./api/covid";

// const about = () => {
//     return {
//         text:
//             'I am a Glip COVID 19 bot, I am created by ![:Person](850957020). Here is [my source code](https://github.com/jacksonmelcher/COVID19-bot).',
//     };
// };

let county = [];

const handle = async (event) => {
  let covid = [];
  const { type, text, group, bot } = event;

  // county = typeof undefined ? 'nothing' : text.split(' ');
  if (typeof text !== "undefined") {
    let split = text.split(" ");
    // console.log('SPLIT AT INDEX 1: ' + split[1]);
    county.push(split[0]);
    county.push(split[1]);
    console.log("County at index 1: " + county[0]);
    console.log("County at index 2: " + county[1]);
  }

  covid = await getData(county[1]);
  if (type === "Message4Bot" && county[0] === "stats") {
    await bot.sendMessage(group.id, {
      attachments: [
        {
          type: "Card",
          text: `Covid Cases for **${covid[0].county}**: \n ${covid
            .map((data) => `Cases: **${data.cases}** - Date: **${data.date}**`)
            .join("\n\n")}`,
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
      text: "test",
    });
    // await bot.sendMessage(group.id, about());
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
