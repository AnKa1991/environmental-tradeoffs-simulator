const fmt = (value, digits = 0) =>
  new Intl.NumberFormat("pl-PL", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(Number.isFinite(value) ? value : 0);

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const state = {
  active: "noise",
  notes: "",
  noise: {
    preset: "custom",
    scenario: "wind",
    distance: 650,
    sources: 5,
    soundPower: 102,
    period: "night",
    screen: true,
    nightReduction: 30,
    greenBelt: true,
    enclosure: false,
    silencer: false,
  },
  energy: {
    plant: "coal",
    fuel: "coal",
    power: 180,
    efficiency: 36,
    sulfur: 0.8,
    hours: 8760,
    electrofilter: true,
    bagFilter: false,
    ios: true,
    sncr: true,
    scr: false,
    lowNox: true,
    alternative: "modernization",
  },
  itpok: {
    preset: "custom",
    population: 760000,
    wastePerCapita: 390,
    combustibleShare: 62,
    calorificValue: 9.5,
    moisture: 32,
    electricEfficiency: 15,
    heatRecovery: 55,
    flueGasSystem: "bat",
    socialAcceptance: 55,
    distance: 800,
    investmentCost: 980,
    temperature: 850,
    residenceTime: 2,
    lines: 2,
  },
};

const noisePresetDescriptions = {
  custom: "Scenariusz własny: student samodzielnie dobiera parametry. Każda ręczna zmiana suwaka lub wyboru przełącza wariant na ten tryb.",
  conflict: "Scenariusz konfliktowy: źródło jest blisko zabudowy, pracuje nocą i nie ma istotnych zabezpieczeń. Pokazuje, że formalny projekt może szybko stać się problemem społecznym.",
  protected: "Scenariusz z ochroną: większa odległość, ekran, pas zieleni, tłumik i redukcja pracy nocnej. Pokazuje koszt uzyskania niższego ryzyka.",
};

const noiseVariantDescriptions = {
  wind:
    "Wariant I - farma wiatrowa. Student analizuje grupę turbin wiatrowych zlokalizowanych w pobliżu zabudowy. Istotne są odległość, liczba turbin, praca nocna, tło akustyczne i społeczna percepcja migotania, widoczności oraz hałasu aerodynamicznego.",
  biomass:
    "Wariant II - elektrociepłownia biomasowa. Źródłami hałasu są wentylatory, przenośniki paliwa, układ przygotowania biomasy, komin, instalacje pomocnicze i transport paliwa. Ochrona może obejmować obudowy, tłumiki, ekranowanie i organizację dostaw.",
  gas:
    "Wariant III - blok gazowy. Model obejmuje turbinę gazową, układ wlotu i wylotu powietrza, wentylatory, chłodzenie oraz pracę źródła w trybie podstawowym lub szczytowym. Kluczowe są tłumiki, obudowa akustyczna i ograniczenia pracy nocnej.",
  substation:
    "Wariant IV - stacja transformatorowa. Dominującym źródłem może być ciągły ton transformatorów, układy chłodzenia i urządzenia pomocnicze. Nawet bez dużych poziomów dB problemem może być tonalność i stała praca nocna.",
};

const noiseScenarioPresets = {
  wind: {
    conflict: { distance: 350, sources: 8, soundPower: 106, period: "night", screen: false, nightReduction: 0, greenBelt: false, enclosure: false, silencer: false },
    protected: { distance: 950, sources: 6, soundPower: 102, period: "night", screen: false, nightReduction: 45, greenBelt: true, enclosure: false, silencer: true },
  },
  biomass: {
    conflict: { distance: 260, sources: 10, soundPower: 108, period: "night", screen: false, nightReduction: 0, greenBelt: false, enclosure: false, silencer: false },
    protected: { distance: 750, sources: 7, soundPower: 101, period: "night", screen: true, nightReduction: 35, greenBelt: true, enclosure: true, silencer: true },
  },
  gas: {
    conflict: { distance: 300, sources: 6, soundPower: 111, period: "night", screen: false, nightReduction: 0, greenBelt: false, enclosure: false, silencer: false },
    protected: { distance: 800, sources: 5, soundPower: 103, period: "night", screen: true, nightReduction: 40, greenBelt: true, enclosure: true, silencer: true },
  },
  substation: {
    conflict: { distance: 180, sources: 4, soundPower: 99, period: "night", screen: false, nightReduction: 0, greenBelt: false, enclosure: false, silencer: false },
    protected: { distance: 520, sources: 4, soundPower: 94, period: "night", screen: true, nightReduction: 10, greenBelt: true, enclosure: true, silencer: false },
  },
};

const itpokPresetDescriptions = {
  custom: "Scenariusz własny: student sam dobiera skalę miasta, parametry odpadów, oczyszczanie spalin, akceptację społeczną i liczbę linii.",
  risk: "ITPOK ryzykowny: wysoki udział frakcji palnej, słabsze oczyszczanie spalin, niska akceptacja społeczna i mała odległość od zabudowy.",
  bat: "ITPOK BAT: wariant oparty o lepsze oczyszczanie spalin, stabilniejszy proces, wyższą akceptację i lepszy odzysk ciepła.",
  thirdLine: "Wariant 3 linii: pokazuje efekt zwiększenia przepustowości względem instalacji z 2 liniami. Produkcja energii rośnie, ale rosną też strumienie spalin, pozostałości i ryzyko przewymiarowania.",
};

const modules = {
  noise: {
    title: "Hałas",
    icon: "dB",
    lead: "Symulacja pokazuje wpływ lokalizacji, pory doby i zabezpieczeń na poziom hałasu przy zabudowie.",
  },
  energy: {
    title: "Modernizacja źródła energii",
    icon: "MW",
    lead: "Case starego bloku lub kotłowni: student porównuje paliwo, czas pracy i technologie redukcji emisji.",
  },
  itpok: {
    title: "ITPOK / spalarnia odpadów",
    icon: "GOZ",
    lead: "Projekt instalacji dla miasta: bilans odpadów, energii, oczyszczania spalin i akceptacji społecznej.",
  },
};

const moduleContexts = {
  noise: {
    installation:
      "Model dotyczy czterech wariantów instalacji energetycznych lub infrastrukturalnych pracujących w pobliżu zabudowy. Wariant I to farma wiatrowa, gdzie student ocenia grupę turbin i wpływ odległości od zabudowy. Wariant II to elektrociepłownia biomasowa z wentylatorami, transportem paliwa, przenośnikami, kominem i urządzeniami pomocniczymi. Wariant III to blok gazowy, w którym istotne są turbina, układ wlotu i wylotu powietrza, chłodzenie oraz tłumiki. Wariant IV to stacja transformatorowa, gdzie problemem może być ciągły, często tonalny hałas transformatorów i układów chłodzenia.",
    initial:
      "Dla każdego wariantu są trzy scenariusze: konfliktowy, z ochroną i własny. Scenariusz konfliktowy ustawia źródło blisko zabudowy, zwykle w porze nocnej i bez istotnych zabezpieczeń. Scenariusz z ochroną dodaje większą odległość, ekran, pas zieleni, tłumiki, obudowy albo ograniczenie pracy nocnej. Scenariusz własny pojawia się automatycznie, gdy student zmieni dowolny parametr.",
    goal:
      "Celem modelu jest pokazanie, że ocena hałasu nie kończy się na jednej liczbie dB. Liczy się pora doby, odległość, liczba źródeł, skuteczność zabezpieczeń, koszt oraz ryzyko konfliktu społecznego.",
  },
  energy: {
    installation:
      "Model opisuje istniejące źródło spalania paliw: stary blok węglowy, elektrociepłownię albo kotłownię przemysłową. Instalacja ma określoną moc, sprawność, paliwo i czas pracy, a student dobiera technologie ograniczania emisji.",
    initial:
      "Punkt startowy to modernizowany blok opalany węglem z odpylaniem, odsiarczaniem, SNCR i palnikami niskoemisyjnymi. Warianty można zmienić na gaz, biomasę, miks albo mazut, a następnie porównać modernizację, pracę szczytową, konwersję, zamknięcie lub zastąpienie źródła OZE z magazynem.",
    goal:
      "Celem modelu jest przećwiczenie decyzji, w której poprawa emisji lokalnych nie musi oznaczać dobrej decyzji klimatycznej lub ekonomicznej. Student ma zobaczyć kompromis między CO2, SO2, NOx, pyłem, kosztem i rolą źródła w systemie.",
  },
  itpok: {
    installation:
      "Model dotyczy instalacji termicznego przekształcania odpadów komunalnych dla miasta. Instalacja przyjmuje frakcję resztkową, odzyskuje energię elektryczną i ciepło, wytwarza żużel oraz odpady z oczyszczania spalin, a jej ocena zależy także od akceptacji społecznej.",
    initial:
      "Punkt startowy odpowiada dużemu miastu i instalacji z dwiema liniami technologicznymi, systemem oczyszczania spalin BAT, procesem 850°C / 2 s oraz umiarkowaną akceptacją społeczną. Student może wybrać wariant ryzykowny, BAT, 3 linie albo wariant własny.",
    goal:
      "Celem modelu jest sprawdzenie, czy ITPOK jest właściwie dobrany do strumienia odpadów i czy decyzja jest jednocześnie technicznie, środowiskowo, energetycznie i społecznie obroniona. Model ma też pokazać, że zwiększenie liczby linii zwiększa przepustowość, ale może podnieść emisje roczne i ryzyko przewymiarowania.",
  },
};

const legalRequirements = {
  noise: {
    name: "Dopuszczalne poziomy hałasu w środowisku",
    basis:
      "Podstawą oceny są dopuszczalne poziomy hałasu w środowisku, wyrażane m.in. wskaźnikami LAeq D i LAeq N dla pory dnia i nocy. W modelu uproszczono limity do wartości dydaktycznych: 55 dB dla dnia i 45 dB dla nocy.",
    consequence:
      "Dlatego aplikacja porównuje poziom przy zabudowie z limitem dla wybranej pory oraz pokazuje przekroczenie, koszt ochrony i wskaźnik konfliktu społecznego.",
  },
  energy: {
    name: "Dyrektywa IED + BAT LCP dla dużych obiektów spalania",
    basis:
      "Dla dużych źródeł spalania punktem odniesienia są pozwolenie zintegrowane, dyrektywa IED oraz konkluzje BAT LCP. W pozwoleniach zintegrowanych analizuje się potencjał pracy instalacji w całym roku, dlatego model przyjmuje 8760 h/rok jako podstawowy czas pracy.",
    consequence:
      "Z tego wynikają wymagania ograniczania SO2, NOx i pyłu przez IOS, SNCR/SCR, odpylanie oraz techniki pierwotne. CO2 nie jest klasycznym limitem BAT-AEL, ale jest kluczowy dla decyzji klimatycznej i ekonomicznej.",
  },
  itpok: {
    name: "Dyrektywa IED + BAT WI dla spalania odpadów",
    basis:
      "Dla ITPOK znaczenie mają dyrektywa IED, rozdział o spalaniu odpadów oraz konkluzje BAT WI. Model pokazuje warunek procesu 850°C / 2 s, dobór oczyszczania spalin, monitoring i emisje roczne.",
    consequence:
      "Dlatego aplikacja nie ocenia wyłącznie energii z odpadów. Sprawdza też stabilność procesu, system oczyszczania spalin, pozostałości po spalaniu, przepustowość i akceptację społeczną.",
  },
};

function calculateNoise(input) {
  const distanceLoss = 20 * Math.log10(Math.max(input.distance, 1)) + 11;
  const sourceGain = 10 * Math.log10(input.sources);
  const baseLevel = input.soundPower + sourceGain - distanceLoss;
  const screenReduction = input.screen ? 8 : 0;
  const nightReduction = input.period === "night" ? input.nightReduction * 0.11 : 0;
  const greenReduction = input.greenBelt ? 2 : 0;
  const enclosureReduction = input.enclosure ? 7 : 0;
  const silencerReduction = input.silencer ? 5 : 0;
  const level = Math.round((baseLevel - screenReduction - nightReduction - greenReduction - enclosureReduction - silencerReduction) * 10) / 10;
  const limit = input.period === "night" ? 45 : 55;
  const exceedance = Math.max(0, level - limit);
  const mitigationCost =
    (input.screen ? input.distance * 1200 : 0) +
    (input.greenBelt ? 180000 : 0) +
    (input.enclosure ? input.sources * 260000 : 0) +
    (input.silencer ? input.sources * 95000 : 0) +
    (input.nightReduction > 0 ? input.sources * input.nightReduction * 2500 : 0);
  const perception = input.period === "night" ? 18 : 6;
  const proximity = clamp((900 - input.distance) / 9, 0, 70);
  const conflict = Math.round(clamp(exceedance * 9 + proximity + perception + input.sources * 1.2 - (input.greenBelt ? 7 : 0), 0, 100));
  const complianceScore = clamp(100 - exceedance * 18, 0, 100);
  const socialScore = clamp(100 - conflict, 0, 100);
  const costScore = clamp(100 - mitigationCost / 50000, 0, 100);
  const finalScore = Math.round(complianceScore * 0.45 + socialScore * 0.35 + costScore * 0.2);
  const warnings = [];

  if (exceedance > 0) warnings.push(`Przekroczenie poziomu dopuszczalnego o ${fmt(exceedance, 1)} dB.`);
  if (input.period === "night" && level > 42) warnings.push("Pora nocna zwiększa wrażliwość odbiorców nawet przy niewielkich przekroczeniach.");
  if (input.distance < 500) warnings.push("Mała odległość od zabudowy istotnie podnosi ryzyko konfliktu społecznego.");
  if (!input.screen && !input.enclosure && !input.silencer && exceedance > 0) warnings.push("Brak skutecznych zabezpieczeń technicznych przy przekroczeniu.");

  let recommendation = "Brak dodatkowych działań";
  if (exceedance > 8 || conflict > 75) recommendation = "Zmiana lokalizacji albo kombinacja metod";
  else if (input.period === "night" && conflict > 55) recommendation = "Ograniczenie pracy nocnej i ekran";
  else if (exceedance > 2) recommendation = "Ekran akustyczny lub obudowa źródeł";
  else if (conflict > 55) recommendation = "Pas zieleni, monitoring i konsultacje";

  return {
    level,
    limit,
    exceedance,
    conflict,
    mitigationCost,
    finalScore,
    recommendation,
    warnings,
    bars: [
      ["Zgodność", Math.round(complianceScore)],
      ["Społeczne", Math.round(socialScore)],
      ["Koszt", Math.round(costScore)],
      ["Lokalizacja", Math.round(clamp(input.distance / 12, 0, 100))],
    ],
  };
}

function calculateEnergy(input) {
  const fuel = {
    coal: { co2: 0.34, so2: 15, nox: 3.2, dust: 1.2, cost: 1.0 },
    gas: { co2: 0.2, so2: 0.05, nox: 1.2, dust: 0.03, cost: 1.35 },
    biomass: { co2: 0.04, so2: 1.8, nox: 2.1, dust: 0.8, cost: 1.2 },
    heavyOil: { co2: 0.28, so2: 18, nox: 2.7, dust: 0.45, cost: 1.45 },
    mix: { co2: 0.22, so2: 6, nox: 2.2, dust: 0.55, cost: 1.18 },
  }[input.fuel];
  const energyMWh = input.power * input.hours;
  const fuelEnergy = energyMWh / (input.efficiency / 100);
  const raw = {
    co2: fuelEnergy * fuel.co2,
    so2: fuelEnergy * fuel.so2 * (input.sulfur / 1) / 1000,
    nox: fuelEnergy * fuel.nox / 1000,
    dust: fuelEnergy * fuel.dust / 1000,
  };
  const reductions = {
    so2: input.ios ? 0.92 : 0,
    nox: 1 - (input.scr ? 0.15 : 1) * (input.sncr ? 0.55 : 1) * (input.lowNox ? 0.78 : 1),
    dust: 1 - (input.bagFilter ? 0.02 : 1) * (input.electrofilter ? 0.08 : 1),
  };
  const emissions = {
    co2: raw.co2,
    so2: raw.so2 * (1 - reductions.so2),
    nox: raw.nox * (1 - reductions.nox),
    dust: raw.dust * (1 - reductions.dust),
  };
  const limits = { so2: energyMWh * 0.12 / 1000, nox: energyMWh * 0.16 / 1000, dust: energyMWh * 0.012 / 1000 };
  const compliant = emissions.so2 <= limits.so2 && emissions.nox <= limits.nox && emissions.dust <= limits.dust;
  const modernizationCost =
    input.power *
    (input.electrofilter ? 0.25 : 0) +
    input.power *
    (input.bagFilter ? 0.4 : 0) +
    input.power *
    (input.ios ? 1.1 : 0) +
    input.power *
    (input.sncr ? 0.18 : 0) +
    input.power *
    (input.scr ? 0.75 : 0) +
    input.power *
    (input.lowNox ? 0.12 : 0);
  const localScore = clamp(
    100 -
      (emissions.so2 / Math.max(limits.so2, 1)) * 18 -
      (emissions.nox / Math.max(limits.nox, 1)) * 18 -
      (emissions.dust / Math.max(limits.dust, 1)) * 18,
    0,
    100
  );
  const climateScore = clamp(100 - emissions.co2 / 9000, 0, 100);
  const economicScore = clamp(100 - modernizationCost / Math.max(input.power * 0.035, 1), 0, 100);
  const flexibilityScore = input.alternative === "peak" ? 82 : input.alternative === "gas" ? 70 : input.alternative === "oze" ? 76 : input.alternative === "closure" ? 55 : 62;
  const finalScore = Math.round(localScore * 0.35 + climateScore * 0.25 + economicScore * 0.18 + flexibilityScore * 0.22);
  const warnings = [];

  if (!compliant) warnings.push("Wariant nie spełnia uproszczonych limitów dla SO2, NOx lub pyłu.");
  if (input.fuel === "coal" && input.hours > 4000) warnings.push("Długa praca źródła węglowego daje wysoki ślad CO2 mimo redukcji emisji lokalnych.");
  if (input.fuel === "heavyOil") warnings.push("Mazut traktujemy jako paliwo awaryjne lub historyczne: ma wysokie ryzyko SO2 i CO2, zwłaszcza bez odsiarczania.");
  if (!input.ios && input.sulfur > 0.5) warnings.push("Przy tej zawartości siarki brak IOS jest ryzykowny.");
  if (!input.scr && emissions.nox > limits.nox) warnings.push("Dla NOx może być potrzebny SCR albo ograniczenie czasu pracy.");
  if (modernizationCost > input.power * 1.6) warnings.push("Koszt modernizacji jest wysoki względem mocy instalacji.");

  let recommendation = "Modernizować";
  if (input.alternative === "closure" || ((input.fuel === "coal" || input.fuel === "heavyOil") && finalScore < 45)) recommendation = "Wycofać";
  else if (input.alternative === "peak" || input.hours < 1800) recommendation = "Pracować tylko jako źródło szczytowe";
  else if (input.alternative === "gas") recommendation = "Konwersja na gaz";
  else if (input.alternative === "oze") recommendation = "Zastąpić OZE + magazyn";
  else if (!compliant) recommendation = "Modernizować warunkowo";

  return {
    energyMWh,
    emissions,
    raw,
    reductions,
    limits,
    compliant,
    modernizationCost,
    finalScore,
    recommendation,
    warnings,
    bars: [
      ["Emisje lokalne", Math.round(localScore)],
      ["CO2", Math.round(climateScore)],
      ["Koszt", Math.round(economicScore)],
      ["Strategia", Math.round(flexibilityScore)],
    ],
  };
}

function calculateItpok(input) {
  const municipalWaste = (input.population * input.wastePerCapita) / 1000;
  const lineCapacity = 110000;
  const installedCapacity = input.lines * lineCapacity;
  const availableCombustibleWaste = municipalWaste * (input.combustibleShare / 100);
  const directedToItpok = Math.min(availableCombustibleWaste, installedCapacity);
  const energyInGJ = directedToItpok * input.calorificValue;
  const grossElectricMWh = (energyInGJ * input.electricEfficiency) / 100 / 3.6;
  const usefulHeatGJ = energyInGJ * (input.heatRecovery / 100);
  const slag = directedToItpok * 0.23;
  const apcr = directedToItpok * 0.035;
  const massReduction = 100 * (1 - (slag + apcr) / Math.max(directedToItpok, 1));
  const processScore = clamp(((input.temperature - 820) / 80) * 45 + ((input.residenceTime - 1.5) / 1.0) * 45 + (input.moisture <= 35 ? 10 : 0), 0, 100);
  const flueScore = input.flueGasSystem === "basic" ? 45 : input.flueGasSystem === "standard" ? 70 : 92;
  const energyScore = clamp((input.electricEfficiency / 18) * 38 + (input.heatRecovery / 70) * 42 + (input.calorificValue / 12) * 20, 0, 100);
  const socialScore = clamp(input.socialAcceptance * 0.7 + (input.distance >= 1000 ? 30 : input.distance >= 700 ? 22 : input.distance >= 500 ? 12 : 4), 0, 100);
  const sizingScore = clamp(100 - Math.abs(installedCapacity - availableCombustibleWaste) / 3200, 35, 100);
  const costScore = clamp(100 - input.investmentCost / 18, 0, 100);
  const flueEmissionFactors = {
    basic: { nox: 1.15, so2: 0.42, dust: 0.08 },
    standard: { nox: 0.72, so2: 0.2, dust: 0.035 },
    bat: { nox: 0.42, so2: 0.09, dust: 0.015 },
  }[input.flueGasSystem];
  const emissions = {
    nox: directedToItpok * flueEmissionFactors.nox / 1000,
    so2: directedToItpok * flueEmissionFactors.so2 / 1000,
    dust: directedToItpok * flueEmissionFactors.dust / 1000,
  };
  const thirdLineComparison = {
    waste: Math.min(availableCombustibleWaste, 3 * lineCapacity),
  };
  thirdLineComparison.emissions = {
    nox: thirdLineComparison.waste * flueEmissionFactors.nox / 1000,
    so2: thirdLineComparison.waste * flueEmissionFactors.so2 / 1000,
    dust: thirdLineComparison.waste * flueEmissionFactors.dust / 1000,
  };
  thirdLineComparison.deltaWaste = thirdLineComparison.waste - Math.min(availableCombustibleWaste, 2 * lineCapacity);
  thirdLineComparison.deltaNox = thirdLineComparison.emissions.nox - (Math.min(availableCombustibleWaste, 2 * lineCapacity) * flueEmissionFactors.nox / 1000);
  const finalScore = Math.round(processScore * 0.22 + flueScore * 0.22 + energyScore * 0.18 + socialScore * 0.16 + sizingScore * 0.12 + costScore * 0.1);
  const warnings = [];

  if (input.temperature < 850 || input.residenceTime < 2) warnings.push("Warunek procesu 850°C / 2 s nie jest spełniony.");
  if (input.flueGasSystem === "basic") warnings.push("System oczyszczania spalin jest zbyt prosty dla nowoczesnej ITPOK.");
  if (input.socialAcceptance < 45) warnings.push("Niska akceptacja społeczna wymaga procesu dialogu, monitoringu i transparentności danych.");
  if (input.moisture > 40) warnings.push("Wysoka wilgotność pogarsza stabilność spalania i bilans energii.");
  if (directedToItpok > municipalWaste * 0.72) warnings.push("Duży udział odpadów kierowanych do spalania może osłabić hierarchię postępowania z odpadami.");
  if (installedCapacity > availableCombustibleWaste * 1.25) warnings.push("Instalacja może być przewymiarowana względem dostępnej frakcji palnej.");
  if (input.lines === 3) warnings.push("Trzecia linia zwiększa przepustowość i emisje roczne, nawet jeżeli jednostkowe standardy oczyszczania pozostają takie same.");
  if (input.investmentCost > 1300) warnings.push("Wysoki koszt inwestycji wymaga mocnego uzasadnienia energetycznego i odpadowego.");

  let recommendation = "Rekomendować budowę warunkowo";
  if (finalScore >= 75) recommendation = "Rekomendować budowę";
  else if (finalScore < 50) recommendation = "Odrzucić albo istotnie przeprojektować";
  else if (socialScore < 48) recommendation = "Technicznie możliwe, społecznie ryzykowne";
  else if (flueScore < 60) recommendation = "Wzmocnić oczyszczanie spalin";

  return {
    municipalWaste,
    availableCombustibleWaste,
    installedCapacity,
    directedToItpok,
    energyInGJ,
    grossElectricMWh,
    usefulHeatGJ,
    slag,
    apcr,
    massReduction,
    emissions,
    thirdLineComparison,
    finalScore,
    recommendation,
    warnings,
    bars: [
      ["Proces", Math.round(processScore)],
      ["Spaliny", Math.round(flueScore)],
      ["Energia", Math.round(energyScore)],
      ["Społeczne", Math.round(socialScore)],
      ["Dobór mocy", Math.round(sizingScore)],
      ["Koszt", Math.round(costScore)],
    ],
  };
}

function currentResults() {
  if (state.active === "noise") return calculateNoise(state.noise);
  if (state.active === "energy") return calculateEnergy(state.energy);
  return calculateItpok(state.itpok);
}

function scoreClass(score) {
  if (score >= 75) return "good";
  if (score >= 50) return "medium";
  return "bad";
}

function setValue(module, key, value) {
  state[module][key] = value;
  if (module === "noise" && key !== "preset") state.noise.preset = "custom";
  if (module === "itpok" && key !== "preset") state.itpok.preset = "custom";
  render();
}

function slider(module, key, label, min, max, step, unit, help, digits = 0) {
  const value = state[module][key];
  return `
    <div class="control">
      <div class="control__head">
        <div>
          <label for="${module}-${key}">${label}</label>
          <small>${help}</small>
        </div>
        <div class="value-pill">${fmt(value, digits)} ${unit}</div>
      </div>
      <input id="${module}-${key}" type="range" min="${min}" max="${max}" step="${step}" value="${value}"
        oninput="setValue('${module}', '${key}', Number(this.value))" />
      <div class="range-scale"><span>${fmt(min, digits)} ${unit}</span><span>${fmt(max, digits)} ${unit}</span></div>
    </div>
  `;
}

function selectField(module, key, label, help, options) {
  const value = state[module][key];
  return `
    <div class="field">
      <label for="${module}-${key}">${label}</label>
      <small>${help}</small>
      <select id="${module}-${key}" onchange="setValue('${module}', '${key}', this.value)">
        ${options.map((opt) => `<option value="${opt[0]}" ${opt[0] === value ? "selected" : ""}>${opt[1]}</option>`).join("")}
      </select>
    </div>
  `;
}

function checkbox(module, key, label, help) {
  const checked = state[module][key] ? "checked" : "";
  return `
    <label class="check-tile">
      <input type="checkbox" ${checked} onchange="setValue('${module}', '${key}', this.checked)" />
      <div>${label}<span>${help}</span></div>
    </label>
  `;
}

function metric(icon, label, value, note) {
  return `
    <div class="metric">
      <div class="metric__top">
        <div class="metric__icon">${icon}</div>
        <div>
          <div class="metric__label">${label}</div>
          <div class="metric__value">${value}</div>
        </div>
      </div>
      <p class="metric__note">${note}</p>
    </div>
  `;
}

function bars(items) {
  return `
    <div class="panel">
      <div class="panel__body">
        <div class="section-title"><div class="icon">%</div><h2>Ocena wielokryterialna</h2></div>
        <div class="bars">
          ${items
            .map(
              ([label, value]) => `
                <div class="bar-row">
                  <strong>${label}</strong>
                  <div class="bar-track"><div class="bar-fill" style="width:${clamp(value, 0, 100)}%"></div></div>
                  <span>${value}</span>
                </div>
              `
            )
            .join("")}
        </div>
      </div>
    </div>
  `;
}

function warningBlock(warnings) {
  if (!warnings.length) return `<div class="ok-note">Brak głównych ostrzeżeń w uproszczonym modelu. Pełna ocena wymaga danych rzeczywistych i dokumentacji projektowej.</div>`;
  return `<div class="warning-list">${warnings.map((warning) => `<div class="warning">${warning}</div>`).join("")}</div>`;
}

function decision(result, text) {
  return `
    <div class="decision ${scoreClass(result.finalScore)}">
      <h3>${result.recommendation} · ${result.finalScore}/100</h3>
      <p>${text}</p>
    </div>
  `;
}

function infoBox(title, text) {
  return `
    <div class="note-card">
      <strong>${title}</strong>
      <p style="margin-top: 6px;">${text}</p>
    </div>
  `;
}

function moduleContextBox(moduleKey) {
  const context = moduleContexts[moduleKey];
  return `
    <div class="context-grid">
      ${infoBox("Opis instalacji", context.installation)}
      ${infoBox("Warunki początkowe", context.initial)}
      ${infoBox("Cel modelu", context.goal)}
    </div>
  `;
}

function legalRequirementsBox(moduleKey) {
  const law = legalRequirements[moduleKey];
  return `
    <div class="panel legal-panel">
      <div class="panel__body">
        <div class="section-title"><div class="icon">§</div><h2>Wymagania prawne</h2></div>
        <p><strong>${law.name}</strong></p>
        <p class="law-text">${law.basis}</p>
        <p class="law-text">${law.consequence}</p>
      </div>
    </div>
  `;
}

function noiseScenarioDescription() {
  return `${noiseVariantDescriptions[state.noise.scenario]} ${noisePresetDescriptions[state.noise.preset]}`;
}

function renderNoise() {
  const r = calculateNoise(state.noise);
  return `
    <div class="layout">
      <div class="panel">
        <div class="panel__body">
          <div class="section-title"><div class="icon">dB</div><h2>Parametry scenariusza</h2></div>
          ${infoBox("Co oznacza wybrany wariant i scenariusz?", noiseScenarioDescription())}
          <div style="height: 12px;"></div>
          <div class="controls">
            ${selectField("noise", "scenario", "Wariant instalacji", "Najpierw wybierz typ instalacji, a potem jeden z trzech scenariuszy dla tego wariantu.", [
              ["wind", "Wariant I - farma wiatrowa"],
              ["biomass", "Wariant II - elektrociepłownia biomasowa"],
              ["gas", "Wariant III - blok gazowy"],
              ["substation", "Wariant IV - stacja transformatorowa"],
            ])}
            ${slider("noise", "distance", "Odległość od zabudowy", 150, 1500, 50, "m", "Większa odległość zmniejsza poziom hałasu i napięcie społeczne.")}
            ${slider("noise", "sources", "Liczba źródeł hałasu", 1, 20, 1, "szt.", "Kilka podobnych źródeł sumuje się logarytmicznie.")}
            ${slider("noise", "soundPower", "Poziom mocy akustycznej źródła", 85, 115, 1, "dB", "Parametr źródła, a nie poziom przy zabudowie.")}
            ${selectField("noise", "period", "Pora pracy", "Noc ma niższy limit i większą wrażliwość społeczną.", [
              ["day", "Dzień"],
              ["night", "Noc"],
            ])}
            ${slider("noise", "nightReduction", "Redukcja pracy nocnej", 0, 80, 5, "%", "Ograniczenie mocy lub czasu pracy w nocy.", 0)}
            <div class="switch-grid">
              ${checkbox("noise", "screen", "Ekran akustyczny", "Redukcja przyjęta dydaktycznie: 8 dB.")}
              ${checkbox("noise", "greenBelt", "Pas zieleni", "Mała redukcja akustyczna, większy efekt percepcyjny.")}
              ${checkbox("noise", "enclosure", "Obudowa źródła", "Silna metoda dla źródeł punktowych.")}
              ${checkbox("noise", "silencer", "Tłumik", "Dobra metoda dla wentylatorów i wyrzutni.")}
            </div>
          </div>
        </div>
      </div>
      <div class="results">
        <div class="metrics">
          ${metric("dB", "Hałas przy zabudowie", `${fmt(r.level, 1)} dB`, `Limit dla wybranej pory: ${fmt(r.limit)} dB.`)}
          ${metric("!", "Przekroczenie", `${fmt(r.exceedance, 1)} dB`, r.exceedance > 0 ? "Wymaga działań lub zmiany założeń." : "Brak przekroczenia w uproszczonym modelu.")}
          ${metric("S", "Wskaźnik konfliktu", `${fmt(r.conflict)} / 100`, "Uwzględnia odległość, porę doby, przekroczenie i percepcję.")}
          ${metric("PLN", "Koszt zabezpieczeń", `${fmt(r.mitigationCost / 1000000, 2)} mln zł`, "Szacunek dydaktyczny dla porównania wariantów.")}
        </div>
        ${bars(r.bars)}
        ${decision(r, "Dobry wariant nie polega wyłącznie na spełnieniu limitu. Lokalizacja, nocna percepcja hałasu i koszt ochrony mogą zmienić decyzję projektową.")}
        <div class="panel"><div class="panel__body"><div class="section-title"><div class="icon">!</div><h2>Uwagi</h2></div>${warningBlock(r.warnings)}</div></div>
      </div>
    </div>
  `;
}

function renderEnergy() {
  const r = calculateEnergy(state.energy);
  return `
    <div class="layout">
      <div class="panel">
        <div class="panel__body">
          <div class="section-title"><div class="icon">MW</div><h2>Parametry źródła</h2></div>
          <div class="controls">
            ${selectField("energy", "plant", "Obiekt", "Wybierz punkt wyjścia dla dyskusji projektowej.", [
              ["coal", "Stary blok węglowy"],
              ["chp", "Elektrociepłownia"],
              ["boiler", "Kotłownia przemysłowa"],
            ])}
            ${selectField("energy", "fuel", "Rodzaj paliwa", "Paliwo wpływa na CO2 oraz emisje lokalne.", [
              ["coal", "Węgiel"],
              ["gas", "Gaz"],
              ["biomass", "Biomasa"],
              ["heavyOil", "Mazut"],
              ["mix", "Miks"],
            ])}
            ${slider("energy", "power", "Moc instalacji", 20, 500, 10, "MW", "Skala źródła wpływa na emisje i koszt modernizacji.")}
            ${slider("energy", "efficiency", "Sprawność", 24, 55, 1, "%", "Niższa sprawność oznacza większe zużycie paliwa.")}
            ${slider("energy", "sulfur", "Zawartość siarki w paliwie", 0.05, 1.6, 0.05, "%", "Szczególnie ważne dla źródeł węglowych i biomasy.", 2)}
            ${infoBox("Uwaga o mazucie", "Mazut jest tu paliwem dydaktycznym dla wariantów historycznych lub awaryjnych. Przyjęte współczynniki są uproszczone; dla studium konkretnego zakładu warto podmienić je na dane z pozwolenia zintegrowanego albo dokumentacji instalacji.")}
            ${slider("energy", "hours", "Czas pracy w roku", 8760, 8760, 1, "h", "W tym module przyjmujemy założenie z pozwolenia zintegrowanego: potencjalna praca przez cały rok, czyli 8760 h.")}
            ${selectField("energy", "alternative", "Wariant strategiczny", "Werdykt powinien zależeć także od roli źródła w systemie.", [
              ["modernization", "Modernizacja"],
              ["peak", "Praca jako źródło szczytowe"],
              ["closure", "Zamknięcie"],
              ["gas", "Konwersja na gaz"],
              ["oze", "OZE + magazyn"],
            ])}
            <div class="switch-grid">
              ${checkbox("energy", "electrofilter", "Elektrofiltr", "Redukcja pyłu dla większych źródeł.")}
              ${checkbox("energy", "bagFilter", "Filtr workowy", "Bardzo wysoka skuteczność odpylania.")}
              ${checkbox("energy", "ios", "IOS", "Odsiarczanie spalin.")}
              ${checkbox("energy", "sncr", "SNCR", "Podstawowa redukcja NOx.")}
              ${checkbox("energy", "scr", "SCR", "Wysoka redukcja NOx, większy koszt.")}
              ${checkbox("energy", "lowNox", "Palniki niskoemisyjne", "Ograniczają tworzenie NOx u źródła.")}
            </div>
          </div>
        </div>
      </div>
      <div class="results">
        <div class="metrics">
          ${metric("CO2", "CO2", `${fmt(r.emissions.co2 / 1000, 1)} tys. t/rok`, "Emisja klimatyczna po wyborze paliwa i sprawności.")}
          ${metric("SO2", "SO2", `${fmt(r.emissions.so2, 1)} t/rok`, `Limit modelowy: ${fmt(r.limits.so2, 1)} t/rok.`)}
          ${metric("NOx", "NOx", `${fmt(r.emissions.nox, 1)} t/rok`, `Limit modelowy: ${fmt(r.limits.nox, 1)} t/rok.`)}
          ${metric("Pył", "Pył", `${fmt(r.emissions.dust, 1)} t/rok`, `Koszt modernizacji: ${fmt(r.modernizationCost, 1)} mln zł.`)}
        </div>
        ${bars(r.bars)}
        ${decision(r, r.compliant ? "Źródło spełnia uproszczone wymagania lokalne, ale decyzja nadal zależy od CO2, kosztu i roli w systemie." : "Źródło nie spełnia uproszczonych wymagań. Modernizacja musi objąć brakujące technologie albo ograniczenie czasu pracy.")}
        <div class="panel"><div class="panel__body"><div class="section-title"><div class="icon">!</div><h2>Uwagi</h2></div>${warningBlock(r.warnings)}</div></div>
      </div>
    </div>
  `;
}

function renderItpok() {
  const r = calculateItpok(state.itpok);
  return `
    <div class="layout">
      <div class="panel">
        <div class="panel__body">
          <div class="section-title"><div class="icon">GOZ</div><h2>Projekt instalacji</h2></div>
          ${infoBox("Co oznacza wybrany scenariusz?", itpokPresetDescriptions[state.itpok.preset])}
          <div style="height: 12px;"></div>
          <div class="controls">
            ${slider("itpok", "population", "Liczba mieszkańców", 50000, 1200000, 10000, "os.", "Skala miasta określa strumień odpadów.")}
            ${slider("itpok", "wastePerCapita", "Odpady na mieszkańca", 220, 520, 10, "kg/rok", "Parametr zależy od stylu konsumpcji i systemu selektywnej zbiórki.")}
            ${slider("itpok", "combustibleShare", "Udział frakcji palnej", 35, 75, 1, "%", "ITPOK powinien obejmować frakcję resztkową, nie surowce do recyklingu.")}
            ${slider("itpok", "calorificValue", "Wartość opałowa", 6, 14, 0.5, "MJ/kg", "Wyższa wartość ułatwia stabilne spalanie i produkcję energii.", 1)}
            ${slider("itpok", "moisture", "Wilgotność", 15, 50, 1, "%", "Wysoka wilgotność pogarsza bilans procesu.")}
            ${slider("itpok", "electricEfficiency", "Sprawność elektryczna", 10, 22, 1, "%", "Szacunek produkcji energii elektrycznej brutto.")}
            ${slider("itpok", "heatRecovery", "Sprawność odzysku ciepła", 20, 75, 1, "%", "Kogeneracja wzmacnia sens energetyczny instalacji.")}
            ${slider("itpok", "lines", "Liczba linii technologicznych", 2, 3, 1, "linie", "Wariant 3 linii zwiększa przepustowość względem układu z 2 liniami.")}
            ${selectField("itpok", "flueGasSystem", "System oczyszczania spalin", "Dobór układu wpływa na ryzyko przekroczeń i akceptację projektu.", [
              ["basic", "Podstawowy: odpylanie + sorbent"],
              ["standard", "Standardowy: SNCR + absorber + filtr"],
              ["bat", "BAT: SNCR/SCR + absorber + węgiel aktywny + filtr workowy + CEMS"],
            ])}
            ${slider("itpok", "temperature", "Temperatura procesu", 820, 930, 5, "°C", "Warunek dydaktyczny: co najmniej 850°C.")}
            ${slider("itpok", "residenceTime", "Czas przebywania spalin", 1.5, 3, 0.1, "s", "Warunek dydaktyczny: co najmniej 2 sekundy.", 1)}
            ${slider("itpok", "socialAcceptance", "Akceptacja społeczna", 10, 90, 1, "pkt", "Zależy od lokalizacji, transportu, monitoringu i zaufania.")}
            ${slider("itpok", "distance", "Odległość od zabudowy", 300, 1500, 50, "m", "Nie zastępuje BAT, ale wpływa na konflikt społeczny.")}
            ${slider("itpok", "investmentCost", "Koszt inwestycji", 450, 1700, 25, "mln zł", "Koszt porównawczy dla dyskusji o proporcjach korzyści i ryzyk.")}
          </div>
        </div>
      </div>
      <div class="results">
        <div class="metrics">
          ${metric("t", "Odpady komunalne", `${fmt(r.municipalWaste)} t/rok`, "Roczny strumień wynikający z liczby mieszkańców.")}
          ${metric("ITP", "Do ITPOK", `${fmt(r.directedToItpok)} t/rok`, "Frakcja palna kierowana do instalacji.")}
          ${metric("Linie", "Przepustowość", `${fmt(r.installedCapacity)} t/rok`, `Modelowo przyjęto 110 tys. t/rok na linię; dostępna frakcja palna: ${fmt(r.availableCombustibleWaste)} t/rok.`)}
          ${metric("MWh", "Energia elektryczna", `${fmt(r.grossElectricMWh)} MWh/rok`, "Szacunek brutto z energii chemicznej odpadów.")}
          ${metric("GJ", "Ciepło", `${fmt(r.usefulHeatGJ)} GJ/rok`, "Odzysk ciepła użytkowego.")}
          ${metric("Ż", "Żużel", `${fmt(r.slag)} t/rok`, "Pozostałość wymagająca waloryzacji i badań.")}
          ${metric("APCR", "Popioły i APCR", `${fmt(r.apcr)} t/rok`, "Odpady problematyczne do stabilizacji lub unieszkodliwiania.")}
          ${metric("NOx", "NOx ze spalin", `${fmt(r.emissions.nox, 1)} t/rok`, "Uproszczona emisja roczna po wybranym systemie oczyszczania.")}
          ${metric("3L", "Efekt 3 linii", `+${fmt(r.thirdLineComparison.deltaWaste)} t/rok`, `Dodatkowo ok. +${fmt(r.thirdLineComparison.deltaNox, 1)} t NOx/rok względem 2 linii, przy tych samych założeniach oczyszczania.`)}
        </div>
        ${bars(r.bars)}
        ${decision(r, "Werdykt łączy proces, spaliny, energię, społeczeństwo, dobór skali i koszt. ITPOK nie rozwiązuje całej gospodarki odpadami, ale może domykać system dla frakcji resztkowej.")}
        <div class="panel"><div class="panel__body"><div class="section-title"><div class="icon">!</div><h2>Uwagi</h2></div>${warningBlock(r.warnings)}</div></div>
      </div>
    </div>
  `;
}

function setPreset(name) {
  if (name === "noiseCustom") Object.assign(state.noise, { preset: "custom" });
  if (name === "noiseRisk") Object.assign(state.noise, { preset: "conflict" }, noiseScenarioPresets[state.noise.scenario].conflict);
  if (name === "noiseBalanced") Object.assign(state.noise, { preset: "protected" }, noiseScenarioPresets[state.noise.scenario].protected);
  if (name === "energyCoal") Object.assign(state.energy, { fuel: "coal", power: 180, efficiency: 36, sulfur: 0.8, hours: 8760, electrofilter: true, bagFilter: false, ios: true, sncr: true, scr: false, lowNox: true, alternative: "modernization" });
  if (name === "energyPeak") Object.assign(state.energy, { fuel: "gas", power: 160, efficiency: 49, sulfur: 0.05, hours: 8760, electrofilter: false, bagFilter: false, ios: false, sncr: false, scr: false, lowNox: true, alternative: "peak" });
  if (name === "energyMazut") Object.assign(state.energy, { fuel: "heavyOil", power: 120, efficiency: 39, sulfur: 1.1, hours: 8760, electrofilter: true, bagFilter: false, ios: true, sncr: true, scr: false, lowNox: true, alternative: "peak" });
  if (name === "itpokCustom") Object.assign(state.itpok, { preset: "custom" });
  if (name === "itpokRisk") Object.assign(state.itpok, { preset: "risk", lines: 2, combustibleShare: 72, flueGasSystem: "basic", socialAcceptance: 28, distance: 450, temperature: 840, residenceTime: 1.8, heatRecovery: 35, investmentCost: 760 });
  if (name === "itpokBat") Object.assign(state.itpok, { preset: "bat", lines: 2, combustibleShare: 56, flueGasSystem: "bat", socialAcceptance: 72, distance: 1100, temperature: 875, residenceTime: 2.3, heatRecovery: 68, investmentCost: 1180 });
  if (name === "itpokThirdLine") Object.assign(state.itpok, { preset: "thirdLine", lines: 3, combustibleShare: 62, flueGasSystem: "bat", socialAcceptance: 50, distance: 800, temperature: 850, residenceTime: 2, heatRecovery: 60, investmentCost: 1350 });
  render();
}

function presetButtons() {
  if (state.active === "noise") {
    return `
      <span class="button-hint">Scenariusze dla aktualnie wybranego wariantu instalacji:</span>
      <button class="btn secondary" onclick="setPreset('noiseCustom')">Scenariusz własny</button>
      <button class="btn secondary" onclick="setPreset('noiseRisk')">Scenariusz konfliktowy</button>
      <button class="btn secondary" onclick="setPreset('noiseBalanced')">Scenariusz z ochroną</button>
    `;
  }
  if (state.active === "energy") {
    return `
      <button class="btn secondary" onclick="setPreset('energyCoal')">Modernizacja węgla</button>
      <button class="btn secondary" onclick="setPreset('energyPeak')">Źródło szczytowe</button>
      <button class="btn secondary" onclick="setPreset('energyMazut')">Mazut awaryjny</button>
    `;
  }
  return `
    <button class="btn secondary" onclick="setPreset('itpokCustom')">Scenariusz własny</button>
    <button class="btn secondary" onclick="setPreset('itpokRisk')">ITPOK ryzykowny</button>
    <button class="btn secondary" onclick="setPreset('itpokBat')">ITPOK BAT</button>
    <button class="btn secondary" onclick="setPreset('itpokThirdLine')">Wariant 3 linii</button>
  `;
}

function moduleContent() {
  if (state.active === "noise") return renderNoise();
  if (state.active === "energy") return renderEnergy();
  return renderItpok();
}

function reportMetrics() {
  const r = currentResults();
  if (state.active === "noise") {
    return [
      ["Poziom hałasu", `${fmt(r.level, 1)} dB`],
      ["Limit", `${fmt(r.limit)} dB`],
      ["Przekroczenie", `${fmt(r.exceedance, 1)} dB`],
      ["Konflikt społeczny", `${fmt(r.conflict)} / 100`],
      ["Koszt zabezpieczeń", `${fmt(r.mitigationCost / 1000000, 2)} mln zł`],
      ["Rekomendacja", r.recommendation],
    ];
  }
  if (state.active === "energy") {
    return [
      ["CO2", `${fmt(r.emissions.co2 / 1000, 1)} tys. t/rok`],
      ["SO2", `${fmt(r.emissions.so2, 1)} t/rok`],
      ["NOx", `${fmt(r.emissions.nox, 1)} t/rok`],
      ["Pył", `${fmt(r.emissions.dust, 1)} t/rok`],
      ["Koszt modernizacji", `${fmt(r.modernizationCost, 1)} mln zł`],
      ["Werdykt", r.recommendation],
    ];
  }
  return [
    ["Odpady komunalne", `${fmt(r.municipalWaste)} t/rok`],
    ["Do ITPOK", `${fmt(r.directedToItpok)} t/rok`],
    ["Liczba linii", `${state.itpok.lines}`],
    ["Przepustowość", `${fmt(r.installedCapacity)} t/rok`],
    ["Energia elektryczna", `${fmt(r.grossElectricMWh)} MWh/rok`],
    ["Ciepło", `${fmt(r.usefulHeatGJ)} GJ/rok`],
    ["NOx ze spalin", `${fmt(r.emissions.nox, 1)} t/rok`],
    ["SO2 ze spalin", `${fmt(r.emissions.so2, 1)} t/rok`],
    ["Redukcja masy", `${fmt(r.massReduction, 1)}%`],
    ["Werdykt", r.recommendation],
  ];
}

function renderReport() {
  const r = currentResults();
  const active = modules[state.active];
  const warnings = r.warnings.length ? r.warnings : ["Brak głównych ostrzeżeń w uproszczonym modelu."];
  return `
    <div class="report">
      <div class="report-sheet">
        <h2>Raport z symulatora kompromisów środowiskowych</h2>
        <p><strong>Moduł:</strong> ${active.title}</p>
        <p><strong>Ocena końcowa:</strong> ${r.finalScore}/100</p>
        <p><strong>Werdykt:</strong> ${r.recommendation}</p>
        <div class="report-grid">
          ${reportMetrics().map(([label, value]) => `<div class="report-item"><strong>${label}</strong><br>${value}</div>`).join("")}
        </div>
        <h3>Uwagi do decyzji</h3>
        <ul>${warnings.map((warning) => `<li>${warning}</li>`).join("")}</ul>
        <h3>Notatka studenta</h3>
        <p>${state.notes ? state.notes.replace(/</g, "&lt;") : "Brak notatki."}</p>
        <p style="margin-top: 18px; color: #4b5563;">Raport pochodzi z uproszczonego modelu dydaktycznego i nie zastępuje obliczeń projektowych, pomiarów ani procedur administracyjnych.</p>
      </div>
    </div>
  `;
}


function render() {
  const active = modules[state.active];
  const app = document.getElementById("app");
  app.innerHTML = `
    <main class="shell">
      <header class="topbar">
        <div class="topbar__inner">
          <div>
            <div class="eyebrow">Symulator kompromisów środowiskowych</div>
            <h1>${active.title}</h1>
            <p class="lead">${active.lead} Aplikacja pokazuje, że najtańsze rozwiązanie nie zawsze jest środowiskowo lub społecznie akceptowalne.</p>
          </div>
          <div class="top-actions">
            <button class="btn accent" onclick="window.print()">Generuj raport PDF</button>
          </div>
        </div>
      </header>
      <div class="content">
        <nav class="tabs" aria-label="Moduły">
          ${Object.entries(modules)
            .map(([key, module]) => `<button class="tab" aria-selected="${state.active === key}" onclick="state.active='${key}'; render()">${module.icon} · ${module.title}</button>`)
            .join("")}
        </nav>
        <div class="button-row" style="margin-bottom: 14px;">
          ${presetButtons()}
        </div>
        ${moduleContextBox(state.active)}
        ${legalRequirementsBox(state.active)}
        ${moduleContent()}
        <div class="note-card" style="margin-top: 18px;">
          <strong>Notatka do raportu:</strong>
          <div class="field" style="margin-top: 10px;">
            <textarea placeholder="Wpisz krótkie uzasadnienie decyzji studenta..." oninput="state.notes=this.value">${state.notes}</textarea>
          </div>
        </div>
      </div>
    </main>
    ${renderReport()}
  `;
}

window.state = state;
window.setValue = setValue;
window.setPreset = setPreset;
window.render = render;
render();
