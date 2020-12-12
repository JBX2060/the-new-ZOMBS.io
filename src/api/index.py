from pymongo import MongoClient
from flask import Flask, request
from flask_restful import Resource, Api
from flask_jsonpify import jsonify
from flask_cors import CORS
from bson import json_util
from json import dumps, loads
from datetime import datetime
import uuid
import os

prod = "PRODUCTION" in os.environ
client = MongoClient("localhost", 27017)
db = client["api"]

application = Flask(__name__)
api = Api(application)

if not prod:
  cors = CORS(application, resources={ r"*": { "origins": "*" }})

key = uuid.uuid4().hex

with(open("secret.key", "w")) as file:
  file.write(key)
  file.close()

class GetLeaderboard(Resource):
  def get(self):
    category = request.args.get("category")
    time = request.args.get("time")

    if category == "wave":
      result = db.leaderboard.find({}).sort("wave", -1)
    elif category == "score":
      result = db.leaderboard.find({}).sort("score", -1)
    else:
      return {
        "error": "Bad category was specified."
      }

    leaderboard = []

    for party in result:
      days = (datetime.now() - party["time"]).days

      if time in ("24h", "7d", "all"):
        if days <= 1 and time == "24h":
          leaderboard.append(party)
        elif days <= 7 and time == "7d":
          leaderboard.append(party)
        elif time == "all":
          leaderboard.append(party)
      else:
        return {
          "error": "Bad time was specified."
        }

    return {
      "success": True,
      "parties": [{
        "name": party["name"],
        "id": party["id"],
        "players": party["players"],
        "wave": party["wave"],
        "score": party["score"]
      } for party in leaderboard[:5]]
    }

class UpdateLeaderboard(Resource):
  def post(self):
    try:
      json_data = request.get_json(force=True)
      if json_data["key"] == key:
        if all(prop in json_data for prop in ("name", "id", "players", "wave", "score")):
          try:
            db.leaderboard.insert_one({
              "name": json_data["name"],
              "id": int(json_data["id"]),
              "players": json_data["players"],
              "wave": int(json_data["wave"]),
              "score": int(json_data["score"]),
              "time": datetime.now()
            })
          except Exception as err:
            if not "PRODUCTION" in os.environ:
              raise

            return {
              "error": "Something wrong has happened!"
            }
          else:
            return {
              "success": True
            }
        else:
          return {
            "error": "Missing required arguments."
          }
      else:
        return {
          "error": "Key is invalid or missing."
        }
    except Exception as err:
      return {
        "error": "Invalid data."
      }

api.add_resource(GetLeaderboard, "/leaderboard/data" if not prod else "/api/leaderboard/data")
api.add_resource(UpdateLeaderboard, "/leaderboard/update" if not prod else "/api/leaderboard/data")

if __name__ == "__main__":
  application.run(port="8008")
