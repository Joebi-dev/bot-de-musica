import 'dotenv/config'
import { Bot } from "./src/structure/Bot";
new Bot(process.env.TOKEN)
