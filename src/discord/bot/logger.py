import coloredlogs, logging

logger = logging.getLogger(__name__)
coloredlogs.install(level="DEBUG", fmt="%(levelname)s %(message)s", logger=logger)
