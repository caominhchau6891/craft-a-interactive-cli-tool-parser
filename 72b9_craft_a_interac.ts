interface ICommand {
  name: string;
  description: string;
  args: string[];
  aliases: string[];
  action: (args: string[]) => void;
}

interface ICommandParser {
  commands: ICommand[];
  parse(input: string): ICommand | undefined;
}

class CommandParser implements ICommandParser {
  private commands: ICommand[];

  constructor(commands: ICommand[]) {
    this.commands = commands;
  }

  parse(input: string): ICommand | undefined {
    const [command, ...args] = input.split(' ');
    const matchedCommand = this.commands.find((cmd) => cmd.name === command || cmd.aliases.includes(command));
    if (matchedCommand) {
      matchedCommand.action(args);
      return matchedCommand;
    }
    return undefined;
  }
}

interface IInteractiveShell {
  parser: ICommandParser;
  prompt: string;
  start(): void;
}

class InteractiveShell implements IInteractiveShell {
  private parser: ICommandParser;
  private prompt: string;

  constructor(parser: ICommandParser, prompt: string) {
    this.parser = parser;
    this.prompt = prompt;
  }

  start(): void {
    console.log(`Welcome to the interactive shell!`);
    this.loop();
  }

  private loop(): void {
    process.stdout.write(this.prompt);
    process.stdin.once('data', (input) => {
      const command = this.parser.parse(input.toString().trim());
      if (command) {
        console.log(`Executing command: ${command.name}`);
      } else {
        console.log(`Unknown command: ${input}`);
      }
      this.loop();
    });
  }
}

const commands: ICommand[] = [
  {
    name: 'help',
    description: 'Display this help message',
    args: [],
    aliases: ['h'],
    action: () => console.log('Available commands: help, exit'),
  },
  {
    name: 'exit',
    description: 'Exit the interactive shell',
    args: [],
    aliases: ['quit'],
    action: () => process.exit(0),
  },
];

const parser = new CommandParser(commands);
const shell = new InteractiveShell(parser, '> ');
shell.start();