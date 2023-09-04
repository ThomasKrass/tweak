<!-- Based on the Best-README-Template by GitHub user "othneildrew". See: https://github.com/othneildrew/Best-README-Template -->

<a name="readme-top"></a>

[![MIT License][license-shield]][license-url]
![Maintenance][unmaintained-shield]

<br />
<div align="center">
  <a href="https://github.com/ThomasKrass/tweak">
    <img src="images/icon.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Tweak</h3>
  <p align="center">
   A prototype platform that enables viewers to customize livestreams<br/> for an individualized viewing experience.
  </p>
  <br/>
  <br/>
</div>
  
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About the Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#install-and-run-the-project">Install and Run the Project</a></li>
        <li><a href="#setting-up-obs">Setting up OBS</a></li>
        <li><a href="#setting-up-a-customizable-livestream">Setting up a Customizable Livestream</a></li>
      </ul>
    </li>
    <li><a href="#license">License</a></li>
  </ol>
</details>

## About the Project

[![Product Name Screen Shot][product-screenshot]](https://github.com/ThomasKrass/tweak)

This repository contains the web frontend of _Tweak_. Other parts of the application's architecture include the backend services (see [this repository](https://github.com/ThomasKrass/tweak-backend)) and the toolkit application (see [this repository](https://github.com/ThomasKrass/tweak-toolkit)).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

<div style="display: flex; flex-flow: row wrap; gap: .25rem; margin-bottom: 1rem;">
  <img src="https://img.shields.io/badge/docker-000000?style=for-the-badge&logo=docker&logoColor=2496ED">
  <img src="https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white">
  <img src="https://img.shields.io/badge/nginx-000000?style=for-the-badge&logo=nginx&logoColor=009639">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB">
  <img src="https://img.shields.io/badge/tailwindcss-000000?style=for-the-badge&logo=tailwindcss&logoColor=38BDF8">
  <img src="https://img.shields.io/badge/typescript-000000?style=for-the-badge&logo=typescript&logoColor=3178C6">
</div>

This application was developed and tested with _Google Chrome 116_ on _Windows 11_.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Getting Started

The application is configured to run on a local machine. Follow these instructions to install and use the application yourself.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Prerequisites

The following software needs to be installed and running on your local machine:

<div style="display: flex; flex-flow: row wrap; gap: .25rem; margin-bottom: 1rem;">
  <img src="https://img.shields.io/badge/docker desktop-000000?style=for-the-badge&logo=docker&logoColor=2496ED">
  <img src="https://img.shields.io/badge/node.js 18.16.0-000000?style=for-the-badge&logo=nodedotjs&logoColor=5FA04E">
</div>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Install and Run the Project

1. Clone the _Tweak_ Repositories

   ```sh
   git clone https://github.com/ThomasKrass/tweak.git
   git clone https://github.com/ThomasKrass/tweak-backend.git
   git clone https://github.com/ThomasKrass/tweak-toolkit.git
   ```

2. Run the Backend Services

   ```sh
   # In tweak-backend/
   npm start

   # Docker will automatically download and install required dependencies,
   #  build the backend services and run them.
   ```

3. Run the Web Frontend on Port 3000

   ```sh
   # In tweak/
   # This will run the web frontend in development mode on http://localhost:3000
   npm install
   npm run dev

   # Alternatively, run the application in production mode on http://localhost:3000
   npm run build
   npm start
   ```

4. Run the Toolkit on Port 3001

   ```sh
   # In tweak-toolkit/
   # This will run the toolkit application in development mode on http://localhost:3001
   npm install
   npm run dev

   # Alternatively, run the application in production mode on http://localhost:3001
   npm run build
   npm start
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Setting up OBS

Once the application is running on your local machine, open _OBS_ (version 29.1.3) and connect to the streaming server in the following way:

1. Open the settings menu (`File > Settings`)
2. Navigate to `Stream`
3. Select `Custom...` as the `Service`
4. Enter `rtmp://<IP address of your local machine>/live` into the `Server` field (replace `<IP address of your local machine>` with your machine's IP address, e.g., `192.168.178.xx`)
5. Enter `customizable-livestream` as the `Stream-Key`
6. Uncheck `Use authentication`
7. Start streaming

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Setting up a Customizable Livestream

Detailed instructions on how to set up a customizable livestream are included in my master's thesis.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

[license-shield]: https://img.shields.io/github/license/ThomasKrass/tweak.svg?style=for-the-badge
[unmaintained-shield]: https://img.shields.io/badge/project-unmaintained-red.svg?style=for-the-badge
[license-url]: https://github.com/ThomasKrass/tweak/blob/master/LICENSE.txt
[product-screenshot]: images/hero.png
