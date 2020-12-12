import Cli from "Cli/Cli";

function Clear(args) {
  Cli.clear();

  Cli.sendQuestionInput();
}

export default Clear;
