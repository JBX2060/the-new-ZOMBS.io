import os
import discord
import time
import sys

from discord.ext import commands
from dotenv import load_dotenv, find_dotenv
from logger import logger

load_dotenv(find_dotenv())
bot = commands.Bot(command_prefix="$")

@bot.listen()
async def on_ready():
  logger.info(f"Logged in as {bot.user.name}")

  activity = discord.Streaming("coding myself thus rule the world")
  await bot.change_presence(activity=activity)

@bot.remove_command("help")
@bot.command()
async def help(ctx):
  embed = discord.Embed(title="Hello fellow member!", description="""
    I am **{0}**, known for being the *best* bot on this server.
    I can show stats and other cool stuff about the game.
    You've executed this command to see a list of my commands, right?
    There it is:
  """.format(bot.user.name))

  embed.add_field(name="$help", value="Shows help message")

  await ctx.send(embed=embed)

try:
  bot.run(os.getenv("TOKEN"))
except RuntimeError:
  sys.exit()
