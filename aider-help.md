1. Aider supports adding web pages to the chat with the /web <url> command. When you add a url to the chat, aider fetches the page and scrapes its content.

2. Aider supports coding with your voice using the in-chat /voice command. Aider uses the PortAudio library to capture audio. Installing PortAudio is completely optional, but can usually be accomplished like this:

```sh 
For Windows, there is no need to install PortAudio.
For Mac, do `brew install portaudio`
For Linux, do s`udo apt-get install libportaudio2`
```

```sh
--map-tokens VALUE
Max number of tokens to use for repo map, use 0 to disable (default: 1024)
Default: 1024
```