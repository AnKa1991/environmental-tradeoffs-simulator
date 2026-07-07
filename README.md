# Environmental Trade-offs Simulator

**Environmental Trade-offs Simulator** is an educational web application designed to support teaching in environmental protection, environmental engineering and related courses. The simulator helps students explore how technical, environmental, social and economic criteria influence decision-making in selected environmental scenarios.

The application is written in Polish and was created as a teaching tool for students.

## Live version

The application is available online at:

https://anka1991.github.io/environmental-tradeoffs-simulator/

## Educational purpose

The simulator is intended to help students understand that environmental decisions are rarely based on a single criterion. Instead, they require balancing multiple factors, such as emission reduction, legal compliance, technological feasibility, costs, public acceptance and environmental risk.

## Modules

The application includes three teaching modules:

1. **Noise**  
   Assessment of environmental noise scenarios and simplified compliance with limit values.

2. **Modernisation of an energy source**  
   Analysis of selected technical and environmental effects of modernising a combustion-based energy source.

3. **ITPOK / waste-to-energy plant**  
   Simplified assessment of a municipal waste incineration / waste-to-energy scenario, including process conditions, flue gas treatment, energy recovery and social acceptance.

## Features

- Interactive sliders and decision parameters
- Multi-criteria assessment of environmental scenarios
- Educational warnings and interpretation of results
- Polish-language interface
- Report generation through the browser print-to-PDF function
- No external images, datasets or copyrighted media assets
- Can be run locally or published as a static website

## Technologies

- HTML
- CSS
- JavaScript
- Optional local Python server for development/testing

## How to run locally

The simplest option is to open `index.html` directly in a web browser.

Alternatively, if Python is installed, run:

```bash
python server.py
```

Then open the local address shown in the terminal, for example:

```txt
http://127.0.0.1:4173/
```

## How to generate a PDF report

In the application, select the desired scenario and click the report generation option. Then use the browser print dialog and choose **Save as PDF**.

## Repository structure

```txt
.
├── index.html
├── app.js
├── styles.css
├── server.py
├── README.md
├── LICENSE
└── .gitignore
```

## Notes

This repository contains a public version of the application without password protection. The previous password gate was removed because client-side passwords in static web applications are visible in the source code and should not be treated as real security.

## Language

The application interface and educational content are in Polish.

## Author

**AnKa1991**  

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
