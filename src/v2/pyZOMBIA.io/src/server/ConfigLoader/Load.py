from Logger.Logger import logger
from pathlib import Path

import yaml
import sys

with open(Path(__file__).absolute().parent / "../config.yml", "r") as stream:
  try:
    config = yaml.safe_load(stream)

    logger.info("Loaded configuration file")
  except yaml.YAMLError as err:
    logger.error(f"Failed to parse configuration file: {err}")
    sys.exit(1)
