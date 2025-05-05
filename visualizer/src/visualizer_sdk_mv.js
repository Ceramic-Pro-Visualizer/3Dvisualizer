(function (global) {

    class ExposureAnimator {
        constructor(modelViewer) {
          this.modelViewer = modelViewer;
          this.duration = 2000;
          this.fromExposure = 1;
          this.toExposure = 2;
          this.startTime = null;
          this.animationFrame = null;
        }
      
        setExposure = (target, durationMs = 2000) => {
          cancelAnimationFrame(this.animationFrame);
      
          this.fromExposure = Number(this.modelViewer.exposure);
          this.toExposure = Number(target);
          this.duration = Number(durationMs);
          this.startTime = null;
      
          this.animationFrame = requestAnimationFrame(this.animateExposure);

          for (var i = 0; i < this.modelViewer.model.materials.length; i++) {
            const material = this.modelViewer.model.materials[i];

            if (material.name.indexOf('Lights') != -1) {
                const emissive = (target < 1) ? 100 : 0;
                console.log(material)
                material.setEmissiveFactor(255,255,255);
                material.setEmissiveStrength(emissive);
            }
            }
        };
      
        animateExposure = (time) => {
          if (!this.startTime) this.startTime = time;
      
          const elapsed = time - this.startTime;
          const progress = Math.min(elapsed / this.duration, 1);
      
          const ease = progress < 0.5
            ? 2 * progress * progress
            : -1 + (4 - 2 * progress) * progress;
      
          this.modelViewer.exposure =
            this.fromExposure + (this.toExposure - this.fromExposure) * ease;
      
          if (progress < 1) {
            this.animationFrame = requestAnimationFrame(this.animateExposure);
          } else {
            this.startTime = null;
          }
        };
      }
      
      
    const visualizer = {
        version: '0.0.1',
        cacheBuster:'10096',
        callbacks: {},
        pendingEvents: {},
        currentModel: null,
        cameraPosText: null,
        carPaintMaterial: null,
        headlights: [],
        progressBar: null,
        loadingManager: null,
        isOrbiting: false,
        userEvents:[],
        animator:null,
        paintColors:[{ name: "Amaranth Red Metallic", hex: "#BC220D", metallic: true, rgb: ["0.503", "0.016", "0.004", 1], ref: "AmaranthRedMetallic", category: 0, hsl: [0.004, 0.984, 0.253], }, { name: "Arena Red Metallic", hex: "#7C0B26", metallic: true, rgb: ["0.202", "0.003", "0.019", 1], ref: "ArenaRedMetallic", category: 0, hsl: [0.987, 0.967, 0.102], }, { name: "Auburn Metallic", hex: "#7B1010", metallic: true, rgb: ["0.198", "0.005", "0.005", 1], ref: "Auburn Metallic", category: 0, hsl: [0, 0.949, 0.102], }, { name: "Bahia Red", hex: "#E50000", metallic: false, rgb: ["0.784", "0.000", "0.000", 1], ref: "BahiaRed", category: 0, hsl: [0, 1, 0.392], }, { name: "Brocade Red", hex: "#550808", metallic: false, rgb: ["0.091", "0.002", "0.002", 1], ref: "BrocadeRed", category: 0, hsl: [0, 0.948, 0.047], }, { name: "Burgundy Red", hex: "#650712", metallic: false, rgb: ["0.130", "0.002", "0.006", 1], ref: "BurgundyRed", category: 0, hsl: [0.995, 0.968, 0.066], }, { name: "Burgundy Red Metallic", hex: "#7D101C", metallic: true, rgb: ["0.205", "0.005", "0.012", 1], ref: "BurgundyRed Metallic", category: 0, hsl: [0.995, 0.951, 0.105], }, { name: "Carmine Red", hex: "#940000", metallic: false, rgb: ["0.296", "0.000", "0.000", 1], ref: "CarmineRed", category: 0, hsl: [0, 1, 0.148], }, { name: "Carmona Red Metallic", hex: "#8B1934", metallic: true, rgb: ["0.258", "0.010", "0.034", 1], ref: "CarmonaRedMetallic", category: 0, hsl: [0.983, 0.927, 0.134], }, { name: "Cassis Red Metallic", hex: "#CAAEB6", metallic: true, rgb: ["0.591", "0.423", "0.468", 1], ref: "CassisRedMetallic", category: 0, hsl: [0.956, 0.17, 0.507], }, { name: "Coral Red Metallic", hex: "#E93535", metallic: true, rgb: ["0.815", "0.036", "0.036", 1], ref: "CoralRedMetallic", category: 0, hsl: [0, 0.916, 0.425], }, { name: "GTSred", hex: "#AA0000", metallic: false, rgb: ["0.402", "0.000", "0.000", 1], ref: "GTSRed", category: 0, hsl: [0, 1, 0.201], code: "M3E", }, { name: "Gambia Red", hex: "#9A171A", metallic: false, rgb: ["0.323", "0.009", "0.010", 1], ref: "GambiaRed", category: 0, hsl: [0.999, 0.948, 0.166], }, { name: "Garnet Red Metallic", hex: "#8F1B1B", metallic: true, rgb: ["0.275", "0.011", "0.011", 1], ref: "GarnetRedMetallic", category: 0, hsl: [0, 0.923, 0.143], }, { name: "Guards Red", hex: "#FF0000", metallic: false, rgb: ["1.000", "0.000", "0.000", 1], ref: "GuardsRed", category: 0, hsl: [0, 1, 0.5], }, { name: "Impulse Red Metallic", hex: "#C41F1F", metallic: true, rgb: ["0.552", "0.014", "0.014", 1], ref: "ImpulseRed Metallic", category: 0, hsl: [0, 0.952, 0.283], }, { name: "Indiana Red Metallic", hex: "#B74646", metallic: true, rgb: ["0.474", "0.061", "0.061", 1], ref: "IndianaRedMetallic", category: 0, hsl: [0, 0.771, 0.267], }, { name: "Kiln Red Metallic", hex: "#C03B25", metallic: true, rgb: ["0.527", "0.044", "0.019", 1], ref: "KilnRedMetallic", category: 0, hsl: [0.008, 0.932, 0.273], }, { name: "Magenta", hex: "#DA5486", metallic: false, rgb: ["0.701", "0.089", "0.238", 1], ref: "Magenta", category: 0, hsl: [0.959, 0.775, 0.395], }, { name: "Malaga Red", hex: "#AA0808", metallic: false, rgb: ["0.402", "0.002", "0.002", 1], ref: "MalagaRed", category: 0, hsl: [0, 0.988, 0.202], }, { name: "Malvern Red", hex: "#9C0000", metallic: false, rgb: ["0.332", "0.000", "0.000", 1], ref: "CrimsonRed", category: 0, hsl: [0, 1, 0.166], }, { name: "Maraschino Red Metallic", hex: "#6A2727", metallic: true, rgb: ["0.144", "0.020", "0.020", 1], ref: "MaraschinoRed Metallic", category: 0, hsl: [0, 0.753, 0.082], }, { name: "Maroon", hex: "#721616", metallic: false, rgb: ["0.168", "0.008", "0.008", 1], ref: "Maroon", category: 0, hsl: [0, 0.909, 0.088], }, { name: "Mars Red", hex: "#F22F2F", metallic: false, rgb: ["0.888", "0.028", "0.028", 1], ref: "MarsRed", category: 0, hsl: [0, 0.938, 0.458], }, { name: "Metallic Dark Red", hex: "#B54527", metallic: true, rgb: ["0.462", "0.060", "0.020", 1], ref: "MetallicDarkRed", category: 0, hsl: [0.015, 0.916, 0.241], }, { name: "Metallic Red", hex: "#E01212", metallic: true, rgb: ["0.745", "0.006", "0.006", 1], ref: "MetallicRed", category: 0, hsl: [0, 0.984, 0.376], }, { name: "Orient Red Metallic", hex: "#AD2C2C", metallic: true, rgb: ["0.418", "0.025", "0.025", 1], ref: "OrientRedMetallic", category: 0, hsl: [0, 0.886, 0.222], }, { name: "Pascha Red", hex: "#501111", metallic: false, rgb: ["0.080", "0.006", "0.006", 1], ref: "PaschaRed", category: 0, hsl: [0, 0.869, 0.043], }, { name: "Perured", hex: "#B0301F", metallic: false, rgb: ["0.434", "0.030", "0.014", 1], ref: "PeruRed", category: 0, hsl: [0.006, 0.939, 0.224], code: "042", }, { name: "Phoenix Red", hex: "#F63C18", metallic: false, rgb: ["0.922", "0.045", "0.009", 1], ref: "PhoenixRed", category: 0, hsl: [0.007, 0.98, 0.465], }, { name: "Polo Red", hex: "#F72D2D", metallic: false, rgb: ["0.930", "0.026", "0.026", 1], ref: "PoloRed", category: 0, hsl: [0, 0.945, 0.478], }, { name: "Polyantha Red", hex: "#8B0F0F", metallic: false, rgb: ["0.258", "0.005", "0.005", 1], ref: "PolyanthaRed", category: 0, hsl: [0, 0.964, 0.131], }, { name: "Pure Red", hex: "#C81111", metallic: false, rgb: ["0.578", "0.006", "0.006", 1], ref: "Pure Red", category: 0, hsl: [0, 0.981, 0.292], }, { name: "Raspberry Red Metallic", hex: "#AB3F59", metallic: true, rgb: ["0.407", "0.050", "0.100", 1], ref: "RaspberryRedMetallic", category: 0, hsl: [0.977, 0.782, 0.228], }, { name: "Red Metallic", hex: "#D11111", metallic: true, rgb: ["0.638", "0.006", "0.006", 1], ref: "RedMetallic", category: 0, hsl: [0, 0.983, 0.322], }, { name: "Rose Red", hex: "#F12651", metallic: false, rgb: ["0.880", "0.019", "0.082", 1], ref: "RoseRed", category: 0, hsl: [0.988, 0.957, 0.45], }, { name: "Ruby Red", hex: "#C12020", metallic: false, rgb: ["0.533", "0.014", "0.014", 1], ref: "RubyRed", category: 0, hsl: [0, 0.947, 0.274], }, { name: "Ruby Red Metallic", hex: "#AB2A2A", metallic: true, rgb: ["0.407", "0.023", "0.023", 1], ref: "RubyRedMetallic", category: 0, hsl: [0, 0.892, 0.215], }, { name: "Rubystone Red (Ruby Star)", hex: "#CD2761", metallic: false, rgb: ["0.610", "0.020", "0.120", 1], ref: "RubyStone", category: 0, hsl: [0.972, 0.936, 0.315], code: "4SR", }, { name: "Scarlet Red", hex: "#E12F1D", metallic: false, rgb: ["0.753", "0.028", "0.012", 1], ref: "ScarletRed", category: 0, hsl: [0.004, 0.968, 0.383], }, { name: "Sienna Metallic", hex: "#D6432B", metallic: true, rgb: ["0.672", "0.056", "0.024", 1], ref: "SiennaMetallic", category: 0, hsl: [0.008, 0.931, 0.348], }, { name: "Sienna Red Metallic", hex: "#761A02", metallic: true, rgb: ["0.181", "0.010", "0.001", 1], ref: "SiennaRed Metallic", category: 0, hsl: [0.009, 0.993, 0.091], }, { name: "Signal Red", hex: "#F21717", metallic: false, rgb: ["0.888", "0.009", "0.009", 1], ref: "SignalRed", category: 0, hsl: [0, 0.981, 0.448], }, { name: "Strawberry Red", hex: "#E40808", metallic: false, rgb: ["0.776", "0.002", "0.002", 1], ref: "StrawberryRed", category: 0, hsl: [0, 0.994, 0.389], }, { name: "Superiorredmetallic", hex: "#1E0303", metallic: true, rgb: ["0.013", "0.001", "0.001", 1], ref: "SuperiorRedMetallic", category: 0, hsl: [0, 0.869, 0.007], code: "W10", }, { name: "Surinam Red Metallic", hex: "#961212", metallic: true, rgb: ["0.305", "0.006", "0.006", 1], ref: "SurinamRed Metallic", category: 0, hsl: [0, 0.961, 0.156], }, { name: "Turkish Red", hex: "#B80D0D", metallic: false, rgb: ["0.479", "0.004", "0.004", 1], ref: "TurkishRed", category: 0, hsl: [0, 0.983, 0.242], }, { name: "Velvet Red Metallic", hex: "#CA1642", metallic: true, rgb: ["0.591", "0.008", "0.054", 1], ref: "VelvetRedMetallic", category: 0, hsl: [0.987, 0.973, 0.299], }, { name: "Wine Red Metallic", hex: "#C02E16", metallic: true, rgb: ["0.527", "0.027", "0.008", 1], ref: "WineRedMetallic", category: 0, hsl: [0.006, 0.97, 0.268], }, { name: "Zanzibar Red", hex: "#D9401C", metallic: false, rgb: ["0.694", "0.051", "0.012", 1], ref: "ZanzibarRed", category: 0, hsl: [0.01, 0.967, 0.353], }, { name: "Zyclam Red Pearl Effect", hex: "#5C072B", metallic: false, rgb: ["0.107", "0.002", "0.024", 1], ref: "Zyclam-RedPearl Effect", category: 0, hsl: [0.965, 0.961, 0.055], }, { name: "Continental Orange", hex: "#EF4D0E", metallic: false, rgb: ["0.863", "0.074", "0.004", 1], ref: "ContinentalOrange", category: 1, hsl: [0.014, 0.99, 0.434], }, { name: "Copper Metallic", hex: "#C96021", metallic: true, rgb: ["0.584", "0.117", "0.015", 1], ref: "CopperMetallic", category: 1, hsl: [0.03, 0.949, 0.3], }, { name: "Gulforange", hex: "#FF8C2F", metallic: false, rgb: ["1.000", "0.262", "0.028", 1], ref: "GulfOrange", category: 1, hsl: [0.04, 1, 0.514], code: "2G0", }, { name: "Lava Orange", hex: "#FF4200", metallic: false, rgb: ["1.000", "0.054", "0.000", 1], ref: "LavaOrange", category: 1, hsl: [0.009, 1, 0.5], }, { name: "Nepal Orange", hex: "#F4650F", metallic: false, rgb: ["0.905", "0.130", "0.005", 1], ref: "NepalOrange", category: 1, hsl: [0.023, 0.989, 0.455], }, { name: "Orange", hex: "#EE7A3B", metallic: false, rgb: ["0.855", "0.195", "0.044", 1], ref: "Orange", category: 1, hsl: [0.031, 0.903, 0.449], }, { name: "Orange (356)", hex: "#DC551B", metallic: false, rgb: ["0.716", "0.091", "0.011", 1], ref: "Orange(356)", category: 1, hsl: [0.019, 0.97, 0.363], }, { name: "Orange Pearl", hex: "#EC8017", metallic: false, rgb: ["0.839", "0.216", "0.009", 1], ref: "OrangePearl", category: 1, hsl: [0.042, 0.98, 0.424], }, { name: "Orange Red", hex: "#FF6000", metallic: false, rgb: ["1.000", "0.117", "0.000", 1], ref: "OrangeRed", category: 1, hsl: [0.019, 1, 0.5], }, { name: "Pastelorange", hex: "#FF9626", metallic: false, rgb: ["1.000", "0.305", "0.019", 1], ref: "PastelOrange", category: 1, hsl: [0.049, 1, 0.51], code: "Z17", }, { name: "Salmon Metallic", hex: "#B8725F", metallic: true, rgb: ["0.479", "0.168", "0.114", 1], ref: "SalmonMetallic", category: 1, hsl: [0.025, 0.615, 0.297], }, { name: "Signal Orange", hex: "#FF8A00", metallic: false, rgb: ["1.000", "0.254", "0.000", 1], ref: "SignalOrange", category: 1, hsl: [0.042, 1, 0.5], }, { name: "Tangerine", hex: "#FF5F27", metallic: false, rgb: ["1.000", "0.114", "0.020", 1], ref: "Tangerine", category: 1, hsl: [0.016, 1, 0.51], }, { name: "Bahamayellow", hex: "#F2A501", metallic: false, rgb: ["0.888", "0.376", "0.000", 1], ref: "BahamaYellow", category: 2, hsl: [0.071, 0.999, 0.444], code: "Z14", }, { name: "Berber Yellow", hex: "#D7D532", metallic: false, rgb: ["0.680", "0.665", "0.032", 1], ref: "BerberYellow", category: 2, hsl: [0.163, 0.91, 0.356], }, { name: "Champagne Yellow", hex: "#F5EAB7", metallic: false, rgb: ["0.913", "0.823", "0.474", 1], ref: "ChampagneYellow", category: 2, hsl: [0.132, 0.717, 0.693], }, { name: "Chrome Yellow", hex: "#F5F20C", metallic: false, rgb: ["0.913", "0.888", "0.004", 1], ref: "ChromeYellow", category: 2, hsl: [0.162, 0.992, 0.458], }, { name: "Condor Yellow", hex: "#EDEDA9", metallic: false, rgb: ["0.847", "0.847", "0.397", 1], ref: "CondorYellow", category: 2, hsl: [0.167, 0.595, 0.622], }, { name: "Fayence Yellow", hex: "#FFF332", metallic: false, rgb: ["1.000", "0.896", "0.032", 1], ref: "FayenceYellow", category: 2, hsl: [0.149, 1, 0.516], }, { name: "Ferrari Yellow", hex: "#FBE746", metallic: false, rgb: ["0.965", "0.799", "0.061", 1], ref: "FerrariYellow", category: 2, hsl: [0.136, 0.927, 0.513], }, { name: "Goldbronzemetallic", hex: "#C3BE8F", metallic: true, rgb: ["0.546", "0.515", "0.275", 1], ref: "GoldBronzeMetallic", category: 2, hsl: [0.148, 0.33, 0.41], code: "Z52", }, { name: "Gold Metallic", hex: "#E5AC00", metallic: true, rgb: ["0.784", "0.413", "0.000", 1], ref: "GoldMetallic", category: 2, hsl: [0.088, 1, 0.392], }, { name: "Golden Yellow Metallic", hex: "#E7B01A", metallic: true, rgb: ["0.799", "0.434", "0.010", 1], ref: "GoldenYellowMetallic", category: 2, hsl: [0.09, 0.974, 0.405], }, { name: "Hellbronze Metallic", hex: "#D1D1B9", metallic: true, rgb: ["0.638", "0.638", "0.485", 1], ref: "HellbronzeMetallic", category: 2, hsl: [0.167, 0.174, 0.561], }, { name: "Lemon (Canary) Yellow", hex: "#FEF56A", metallic: false, rgb: ["0.991", "0.913", "0.144", 1], ref: "Lemon(Canary)Yellow", category: 2, hsl: [0.151, 0.979, 0.568], }, { name: "Lido Gold", hex: "#DCF1B7", metallic: false, rgb: ["0.716", "0.880", "0.474", 1], ref: "LidoGold", category: 2, hsl: [0.234, 0.628, 0.677], }, { name: "Light Bronze Metallic", hex: "#DCD5B7", metallic: true, rgb: ["0.716", "0.665", "0.474", 1], ref: "LightBronzeMetallic", category: 2, hsl: [0.132, 0.299, 0.595], }, { name: "Light Yellow", hex: "#F7FF9E", metallic: false, rgb: ["0.930", "1.000", "0.342", 1], ref: "LightYellow", category: 2, hsl: [0.184, 1, 0.671], }, { name: "Limegoldmetallic", hex: "#E1E8B4", metallic: true, rgb: ["0.753", "0.807", "0.456", 1], ref: "LimeGoldMetallic", category: 2, hsl: [0.192, 0.476, 0.632], code: "5P1", }, { name: "Mirage Metallic", hex: "#CFC6B8", metallic: true, rgb: ["0.624", "0.565", "0.479", 1], ref: "ChampagneMetallic", category: 2, hsl: [0.098, 0.161, 0.552], }, { name: "Nordicgoldmetallic", hex: "#EB8B0F", metallic: true, rgb: ["0.831", "0.258", "0.005", 1], ref: "NordicGold", category: 2, hsl: [0.051, 0.989, 0.418], code: "M2Z", }, { name: "Pale Yellow", hex: "#F9FFC9", metallic: false, rgb: ["0.947", "1.000", "0.584", 1], ref: "PaleYellow", category: 2, hsl: [0.188, 1, 0.792], }, { name: "Pasadena Yellow", hex: "#F8EFCE", metallic: false, rgb: ["0.939", "0.863", "0.617", 1], ref: "PasadenaYellow", category: 2, hsl: [0.128, 0.724, 0.778], }, { name: "Pastel Yellow", hex: "#FFF4A7", metallic: false, rgb: ["1.000", "0.905", "0.386", 1], ref: "PastelYellow", category: 2, hsl: [0.141, 1, 0.693], }, { name: "Racing Yellow", hex: "#F4F100", metallic: false, rgb: ["0.905", "0.880", "0.000", 1], ref: "RacingYellow", category: 2, hsl: [0.162, 1, 0.452], }, { name: "Rally Yellow", hex: "#ECD438", metallic: false, rgb: ["0.839", "0.658", "0.040", 1], ref: "RallyYellow", category: 2, hsl: [0.129, 0.91, 0.439], }, { name: "Saffron Yellow Metallic", hex: "#DFD942", metallic: true, rgb: ["0.738", "0.694", "0.054", 1], ref: "Saffron Yellow Metallic", category: 2, hsl: [0.156, 0.862, 0.396], }, { name: "Sand Yellow", hex: "#FFD053", metallic: false, rgb: ["1.000", "0.631", "0.087", 1], ref: "SandYellow", category: 2, hsl: [0.099, 1, 0.543], }, { name: "Saturn Yellow", hex: "#EEFB93", metallic: false, rgb: ["0.855", "0.965", "0.292", 1], ref: "SaturnYellow", category: 2, hsl: [0.194, 0.905, 0.628], }, { name: "Signal Yellow", hex: "#FFC601", metallic: false, rgb: ["1.000", "0.565", "0.000", 1], ref: "SignalYellow", category: 2, hsl: [0.094, 1, 0.5], code: "1YH", }, { name: "Speedyellow", hex: "#FFDE00", metallic: false, rgb: ["1.000", "0.730", "0.000", 1], ref: "SpeedYellow", category: 2, hsl: [0.122, 1, 0.5], code: "1SG", }, { name: "Summer Yellow (Early)", hex: "#EDD932", metallic: false, rgb: ["0.847", "0.694", "0.032", 1], ref: "SummerYellowEarly", category: 2, hsl: [0.135, 0.927, 0.439], }, { name: "Summer Yellow (Late)", hex: "#E7F667", metallic: false, rgb: ["0.799", "0.922", "0.136", 1], ref: "SummerYellow", category: 2, hsl: [0.193, 0.834, 0.529], }, { name: "Sunflower Yellow", hex: "#EFCB50", metallic: false, rgb: ["0.863", "0.597", "0.080", 1], ref: "SunflowerYellow", category: 2, hsl: [0.11, 0.83, 0.472], }, { name: "Talbot Yellow", hex: "#FFD955", metallic: false, rgb: ["1.000", "0.694", "0.091", 1], ref: "TalbotYellow", category: 2, hsl: [0.111, 1, 0.545], }, { name: "White Gold Metallic", hex: "#CDCAC0", metallic: true, rgb: ["0.610", "0.591", "0.527", 1], ref: "WhiteGoldMetallic", category: 2, hsl: [0.127, 0.097, 0.569], }, { name: "Acidgreen", hex: "#D4EC53", metallic: false, rgb: ["0.658", "0.839", "0.087", 1], ref: "AcidGreen", category: 3, hsl: [0.207, 0.813, 0.463], code: "2M8", }, { name: "Amazon Green Metallic", hex: "#0A373C", metallic: true, rgb: ["0.003", "0.038", "0.045", 1], ref: "AmazonGreenMetallic", category: 3, hsl: [0.528, 0.874, 0.024], }, { name: "Apple Green (Daphne Green)", hex: "#A1D433", metallic: false, rgb: ["0.356", "0.658", "0.033", 1], ref: "AppleGreen", category: 3, hsl: [0.247, 0.904, 0.346], }, { name: "Ascot (Shamrock) Green", hex: "#51E051", metallic: false, rgb: ["0.082", "0.745", "0.082", 1], ref: "AscotGreen", category: 3, hsl: [0.333, 0.801, 0.414], }, { name: "Auratiumgreen", hex: "#7FC1A1", metallic: false, rgb: ["0.212", "0.533", "0.356", 1], ref: "AuratiumGreen", category: 3, hsl: [0.408, 0.431, 0.373], code: "6AU", }, { name: "Aventura (Aventurine) Green Metallic", hex: "#3D4C45", metallic: true, rgb: ["0.047", "0.072", "0.060", 1], ref: "AventuraGreenMetallic", category: 3, hsl: [0.417, 0.215, 0.059], }, { name: "Birch Green", hex: "#DBFF4D", metallic: false, rgb: ["0.708", "1.000", "0.074", 1], ref: "BirchGreen", category: 3, hsl: [0.219, 1, 0.537], }, { name: "Blackolive", hex: "#3F4131", metallic: false, rgb: ["0.050", "0.053", "0.031", 1], ref: "BlackOlive", category: 3, hsl: [0.19, 0.265, 0.042], code: "2A7", }, { name: "Brewstergreen", hex: "#08361D", metallic: false, rgb: ["0.002", "0.037", "0.012", 1], ref: "BrewsterGreen", category: 3, hsl: [0.381, 0.876, 0.02], code: "22B", }, { name: "Bush (Leaf) Green", hex: "#699F5E", metallic: false, rgb: ["0.141", "0.347", "0.112", 1], ref: "Bush(Leaf)Green", category: 3, hsl: [0.313, 0.512, 0.229], }, { name: "Colibri Green Metallic", hex: "#E3F0DC", metallic: true, rgb: ["0.768", "0.871", "0.716", 1], ref: "ColibriGreen Metallic", category: 3, hsl: [0.277, 0.377, 0.794], }, { name: "Conda Green", hex: "#18A467", metallic: false, rgb: ["0.009", "0.371", "0.136", 1], ref: "CondaGreen", category: 3, hsl: [0.392, 0.952, 0.19], }, { name: "Crystal Green Metallic (Modern)", hex: "#91A499", metallic: true, rgb: ["0.283", "0.371", "0.319", 1], ref: "CrystalGreenMetallic", category: 3, hsl: [0.4, 0.135, 0.327], }, { name: "Crystal Green Metallic (Vintage)", hex: "#91A499", metallic: true, rgb: ["0.283", "0.371", "0.319", 1], ref: "ZermattMetallic", category: 3, hsl: [0.4, 0.135, 0.327], }, { name: "Darkolivemetallic", hex: "#382F14", metallic: true, rgb: ["0.040", "0.028", "0.007", 1], ref: "DarkOliveMetallic", category: 3, hsl: [0.11, 0.699, 0.023], code: "M6X", }, { name: "Delphi Green Metallic", hex: "#A2BC51", metallic: true, rgb: ["0.361", "0.503", "0.082", 1], ref: "DelphiGreenMetallic", category: 3, hsl: [0.223, 0.719, 0.293], }, { name: "Emerald Green Metallic", hex: "#319B3B", metallic: true, rgb: ["0.031", "0.328", "0.044", 1], ref: "EmeraldGreenMetallic", category: 3, hsl: [0.341, 0.829, 0.179], }, { name: "Fern Green", hex: "#42C098", metallic: false, rgb: ["0.054", "0.527", "0.314", 1], ref: "FernGreen", category: 3, hsl: [0.425, 0.813, 0.291], }, { name: "Fjordgreen", hex: "#024642", metallic: false, rgb: ["0.001", "0.061", "0.054", 1], ref: "FjordGreen", category: 3, hsl: [0.481, 0.98, 0.031], code: "705", }, { name: "Forestgreenmetallic", hex: "#093B1F", metallic: true, rgb: ["0.003", "0.044", "0.014", 1], ref: "ForestGreenMetallic", category: 3, hsl: [0.378, 0.882, 0.023], code: "2B4", }, { name: "GT/RS Green", hex: "#20C12D", metallic: false, rgb: ["0.014", "0.533", "0.026", 1], ref: "GT-RSGreen", category: 3, hsl: [0.337, 0.947, 0.274], }, { name: "Golden Green", hex: "#C1CF49", metallic: false, rgb: ["0.533", "0.624", "0.067", 1], ref: "GoldenGreen", category: 3, hsl: [0.194, 0.807, 0.345], }, { name: "Granite Green Metallic", hex: "#A9B3AE", metallic: true, rgb: ["0.397", "0.451", "0.423", 1], ref: "GraniteGreenMetallic", category: 3, hsl: [0.415, 0.064, 0.424], }, { name: "Green", hex: "#5ED58D", metallic: false, rgb: ["0.112", "0.665", "0.266", 1], ref: "Green", category: 3, hsl: [0.38, 0.712, 0.389], }, { name: "Ice (Silver) Green Metallic", hex: "#D0DCD9", metallic: true, rgb: ["0.631", "0.716", "0.694", 1], ref: "IceGreenMetallic", category: 3, hsl: [0.457, 0.13, 0.673], }, { name: "Inari Silver", hex: "#BED7C8", metallic: false, rgb: ["0.515", "0.680", "0.578", 1], ref: "InariSilver", category: 3, hsl: [0.397, 0.204, 0.597], }, { name: "Irishgreen", hex: "#0A430F", metallic: false, rgb: ["0.003", "0.056", "0.005", 1], ref: "IrishGreen", category: 3, hsl: [0.339, 0.897, 0.03], code: "Y79", }, { name: "Jade Green", hex: "#5DE6BE", metallic: false, rgb: ["0.109", "0.791", "0.515", 1], ref: "JadeGreen", category: 3, hsl: [0.432, 0.757, 0.45], }, { name: "Jetgreenmetallic", hex: "#359154", metallic: true, rgb: ["0.036", "0.283", "0.089", 1], ref: "JetGreenMetallic", category: 3, hsl: [0.369, 0.777, 0.159], code: "Z6H", }, { name: "Lago Green (Dark Teal) Metallic", hex: "#163A36", metallic: true, rgb: ["0.008", "0.042", "0.037", 1], ref: "LagogruenMetallic", category: 3, hsl: [0.474, 0.681, 0.025], }, { name: "Lagoon Green Metallic", hex: "#A6C9CA", metallic: true, rgb: ["0.381", "0.584", "0.591", 1], ref: "LagoonGreenMetallic", category: 3, hsl: [0.505, 0.215, 0.486], }, { name: "Light Green Metallic", hex: "#A0BB61", metallic: true, rgb: ["0.352", "0.497", "0.120", 1], ref: "LightGreenMetallic", category: 3, hsl: [0.231, 0.612, 0.308], }, { name: "Lime (Birch) Green", hex: "#88E816", metallic: false, rgb: ["0.246", "0.807", "0.008", 1], ref: "LimeGreen", category: 3, hsl: [0.284, 0.98, 0.407], }, { name: "Lindengreen", hex: "#E0F037", metallic: false, rgb: ["0.745", "0.871", "0.038", 1], ref: "LindenGreen", category: 3, hsl: [0.192, 0.916, 0.455], code: "226", }, { name: "Lizard Green", hex: "#7EE410", metallic: false, rgb: ["0.209", "0.776", "0.005", 1], ref: "LizardGreen", category: 3, hsl: [0.289, 0.987, 0.391], }, { name: "Malachitegreenmetallic", hex: "#39483C", metallic: true, rgb: ["0.041", "0.065", "0.045", 1], ref: "MalachiteGreenMetallic", category: 3, hsl: [0.363, 0.226, 0.053], code: "2B5", }, { name: "Mamba Green Metallic", hex: "#24B130", metallic: true, rgb: ["0.018", "0.440", "0.030", 1], ref: "MambaGreen Metallic", category: 3, hsl: [0.338, 0.923, 0.229], }, { name: "Metallic Dark Green", hex: "#0D3A0A", metallic: true, rgb: ["0.004", "0.042", "0.003", 1], ref: "MetallicDarkGreen", category: 3, hsl: [0.329, 0.866, 0.023], }, { name: "Metallic Green", hex: "#81CF85", metallic: true, rgb: ["0.220", "0.624", "0.235", 1], ref: "MetallicGreen", category: 3, hsl: [0.34, 0.479, 0.422], }, { name: "Mintgreen", hex: "#93FDEA", metallic: false, rgb: ["0.292", "0.982", "0.823", 1], ref: "MintGreen", category: 3, hsl: [0.462, 0.951, 0.637], code: "22R", }, { name: "Mint Green (Dark)", hex: "#6EA687", metallic: false, rgb: ["0.156", "0.381", "0.242", 1], ref: "Mint Green Dark", category: 3, hsl: [0.397, 0.42, 0.269], }, { name: "Moss Green Metallic", hex: "#0E4210", metallic: true, rgb: ["0.004", "0.054", "0.005", 1], ref: "MossGreenMetallic", category: 3, hsl: [0.336, 0.851, 0.029], }, { name: "Murano Green", hex: "#14747D", metallic: false, rgb: ["0.007", "0.175", "0.205", 1], ref: "MuranoGreen", category: 3, hsl: [0.526, 0.934, 0.106], }, { name: "Nile Green Metallic", hex: "#1D391A", metallic: true, rgb: ["0.012", "0.041", "0.010", 1], ref: "NileGreen Metallic", category: 3, hsl: [0.323, 0.597, 0.026], }, { name: "Oakgreenmetallic", hex: "#354829", metallic: true, rgb: ["0.036", "0.065", "0.022", 1], ref: "OakGreenMetallic", category: 3, hsl: [0.281, 0.49, 0.043], code: "6OK", }, { name: "Ocean Jade Metallic", hex: "#0A99A3", metallic: true, rgb: ["0.003", "0.319", "0.366", 1], ref: "OceanJadeMetallic", category: 3, hsl: [0.522, 0.984, 0.185], }, { name: "Olive", hex: "#CCB535", metallic: false, rgb: ["0.604", "0.462", "0.036", 1], ref: "Olive", category: 3, hsl: [0.125, 0.889, 0.32], }, { name: "Olivegreen", hex: "#80921F", metallic: false, rgb: ["0.216", "0.287", "0.014", 1], ref: "OliveGreen", category: 3, hsl: [0.21, 0.909, 0.151], code: "6OG", }, { name: "Olive Green Metallic", hex: "#4C5636", metallic: true, rgb: ["0.072", "0.093", "0.037", 1], ref: "OliveGreenMetallic", category: 3, hsl: [0.228, 0.432, 0.065], }, { name: "Onyx Green Metallic", hex: "#385046", metallic: true, rgb: ["0.040", "0.080", "0.061", 1], ref: "OnyxGreen Metallic", category: 3, hsl: [0.422, 0.34, 0.06], }, { name: "Palm Green", hex: "#237635", metallic: false, rgb: ["0.017", "0.181", "0.036", 1], ref: "PalmGreen", category: 3, hsl: [0.352, 0.83, 0.099], }, { name: "Palma Green Metallic", hex: "#5EF05E", metallic: true, rgb: ["0.112", "0.871", "0.112", 1], ref: "PalmaGreenMetallic", category: 3, hsl: [0.333, 0.772, 0.492], }, { name: "Peridotmetallic", hex: "#C1DF87", metallic: true, rgb: ["0.533", "0.738", "0.242", 1], ref: "PeridotMetallic", category: 3, hsl: [0.235, 0.506, 0.49], code: "2S1", }, { name: "Python Green", hex: "#268C43", metallic: false, rgb: ["0.019", "0.262", "0.056", 1], ref: "Python Green", category: 3, hsl: [0.359, 0.862, 0.141], }, { name: "Racing Green Metallic (Lighter)", hex: "#83B9AB", metallic: true, rgb: ["0.227", "0.485", "0.407", 1], ref: "Racing Green Metallic", category: 3, hsl: [0.45, 0.363, 0.356], code: "Y68", }, { name: "Racinggreenmetallic", hex: "#274C38", metallic: true, rgb: ["0.020", "0.072", "0.040", 1], ref: "RacingGreenMetallic", category: 3, hsl: [0.395, 0.562, 0.046], code: "Y68", }, { name: "Radium Green", hex: "#BBD1CA", metallic: false, rgb: ["0.497", "0.638", "0.591", 1], ref: "RadiumGreen", category: 3, hsl: [0.444, 0.163, 0.567], }, { name: "Rainforest (Jungle) Green Metallic", hex: "#043D28", metallic: true, rgb: ["0.001", "0.047", "0.021", 1], ref: "RainforestGreenMetallic", category: 3, hsl: [0.407, 0.949, 0.024], }, { name: "Ravenna Green", hex: "#B1C845", metallic: false, rgb: ["0.440", "0.578", "0.060", 1], ref: "RavennaGreen", category: 3, hsl: [0.211, 0.813, 0.319], }, { name: "Reseda Green Metallic", hex: "#D4DCB5", metallic: true, rgb: ["0.658", "0.716", "0.462", 1], ref: "ResedaGreen Metallic", category: 3, hsl: [0.204, 0.308, 0.589], }, { name: "Rock Green Metallic", hex: "#B9CBC4", metallic: true, rgb: ["0.485", "0.597", "0.552", 1], ref: "RockGreen Metallic", category: 3, hsl: [0.433, 0.122, 0.541], }, { name: "Sea Green", hex: "#C0DDC1", metallic: false, rgb: ["0.527", "0.723", "0.533", 1], ref: "SeaGreen", category: 3, hsl: [0.339, 0.261, 0.625], }, { name: "Signalgreen", hex: "#47CB7C", metallic: false, rgb: ["0.063", "0.597", "0.202", 1], ref: "SignalGreen", category: 3, hsl: [0.377, 0.809, 0.33], code: "22S", }, { name: "Smyrna Green", hex: "#59C5A0", metallic: false, rgb: ["0.100", "0.558", "0.352", 1], ref: "SmyrnaGreen", category: 3, hsl: [0.425, 0.696, 0.329], }, { name: "Tourmaline (Turmalin) Green Metallic", hex: "#2D8092", metallic: true, rgb: ["0.026", "0.216", "0.287", 1], ref: "TurmalinGreenMetallic", category: 3, hsl: [0.546, 0.833, 0.157], }, { name: "Turquoise Green", hex: "#56B88E", metallic: false, rgb: ["0.093", "0.479", "0.270", 1], ref: "TurquoiseGreen", category: 3, hsl: [0.41, 0.675, 0.286], }, { name: "Turquoise Metallic", hex: "#236D88", metallic: true, rgb: ["0.017", "0.153", "0.246", 1], ref: "TurquoiseMetallic", category: 3, hsl: [0.568, 0.872, 0.132], }, { name: "Vipergreen", hex: "#4BDB59", metallic: false, rgb: ["0.070", "0.708", "0.100", 1], ref: "Emerald(Viper)Green", category: 3, hsl: [0.341, 0.819, 0.389], code: "225", }, { name: "Viper Green Metallic", hex: "#659D22", metallic: true, rgb: ["0.130", "0.337", "0.016", 1], ref: "LimeGreen Metallic", category: 3, hsl: [0.274, 0.909, 0.177], }, { name: "Willowgreen", hex: "#8CC757", metallic: false, rgb: ["0.262", "0.571", "0.095", 1], ref: "WillowGreen", category: 3, hsl: [0.275, 0.714, 0.333], code: "Y83", }, { name: "Wimbledon Green Metallic", hex: "#5CA190", metallic: true, rgb: ["0.107", "0.356", "0.279", 1], ref: "WimbledonGreenMetallic", category: 3, hsl: [0.448, 0.538, 0.232], }, { name: "Zambezi (Forest) Green", hex: "#1D8550", metallic: false, rgb: ["0.012", "0.235", "0.080", 1], ref: "ZambeziGreen", category: 3, hsl: [0.384, 0.9, 0.123], }, { name: "Adriatic Blue", hex: "#236CF2", metallic: false, rgb: ["0.017", "0.150", "0.888", 1], ref: "AdriaticBlue", category: 4, hsl: [0.641, 0.963, 0.452], }, { name: "Aetna Blue (Etna Blue)", hex: "#74A1AD", metallic: false, rgb: ["0.175", "0.356", "0.418", 1], ref: "AetnaBlue", category: 4, hsl: [0.542, 0.411, 0.296], }, { name: "Aga Blue", hex: "#16374E", metallic: false, rgb: ["0.008", "0.038", "0.076", 1], ref: "AgaBlue", category: 4, hsl: [0.593, 0.809, 0.042], }, { name: "Alaska Blue Metallic", hex: "#13657D", metallic: true, rgb: ["0.007", "0.130", "0.205", 1], ref: "AlaskaBlueMetallic", category: 4, hsl: [0.563, 0.938, 0.106], }, { name: "Albertblue", hex: "#0D3872", metallic: false, rgb: ["0.004", "0.040", "0.168", 1], ref: "AlbertBlue", category: 4, hsl: [0.631, 0.953, 0.086], code: "325", }, { name: "Ancona Blue Metallic", hex: "#4673E5", metallic: true, rgb: ["0.061", "0.171", "0.784", 1], ref: "AnaconaBlueMetallic", category: 4, hsl: [0.641, 0.855, 0.422], }, { name: "Aquabluemetallic", hex: "#093DB4", metallic: true, rgb: ["0.003", "0.047", "0.456", 1], ref: "AquaBlueMetallic", category: 4, hsl: [0.651, 0.988, 0.23], code: "M5R", }, { name: "Aquamarine", hex: "#2D5A80", metallic: false, rgb: ["0.026", "0.102", "0.216", 1], ref: "Aquamarine", category: 4, hsl: [0.6, 0.783, 0.121], }, { name: "Aquamarine Blue", hex: "#083379", metallic: false, rgb: ["0.002", "0.033", "0.191", 1], ref: "AquamarineBlue", category: 4, hsl: [0.64, 0.975, 0.097], }, { name: "Aquamarine Metallic", hex: "#6880A0", metallic: true, rgb: ["0.138", "0.216", "0.352", 1], ref: "AquamarineMetallic", category: 4, hsl: [0.606, 0.435, 0.245], }, { name: "Arrowblue", hex: "#389ED9", metallic: false, rgb: ["0.040", "0.342", "0.694", 1], ref: "ArrowBlue", category: 4, hsl: [0.59, 0.892, 0.367], code: "5WB", }, { name: "Azure Blue", hex: "#1B3A73", metallic: false, rgb: ["0.011", "0.042", "0.171", 1], ref: "AzureBlue", category: 4, hsl: [0.634, 0.88, 0.091], }, { name: "Azure Metallic", hex: "#6B93C0", metallic: true, rgb: ["0.147", "0.292", "0.527", 1], ref: "AzureMetallic", category: 4, hsl: [0.603, 0.564, 0.337], }, { name: "Azurite Blue", hex: "#0B1D33", metallic: false, rgb: ["0.003", "0.012", "0.033", 1], ref: "AzuriteBlue", category: 4, hsl: [0.617, 0.816, 0.018], }, { name: "Azurro California", hex: "#A2BACF", metallic: false, rgb: ["0.361", "0.491", "0.624", 1], ref: "AzurroCalifornia", category: 4, hsl: [0.584, 0.267, 0.493], }, { name: "Bahama Blue", hex: "#105CCE", metallic: false, rgb: ["0.005", "0.107", "0.617", 1], ref: "BahamaBlue", category: 4, hsl: [0.639, 0.983, 0.311], }, { name: "Bahama Blue Metallic", hex: "#57789D", metallic: true, rgb: ["0.095", "0.188", "0.337", 1], ref: "BahamaBlue Metallic", category: 4, hsl: [0.603, 0.559, 0.216], }, { name: "Bali Blue", hex: "#073779", metallic: false, rgb: ["0.002", "0.038", "0.191", 1], ref: "BaliBlue", category: 4, hsl: [0.635, 0.978, 0.097], }, { name: "Baltic Blue Metallic", hex: "#41648A", metallic: true, rgb: ["0.053", "0.127", "0.254", 1], ref: "BalticBlueMetallic", category: 4, hsl: [0.605, 0.656, 0.154], }, { name: "Biscay Blue Metallic\t", hex: "#92BFC3", metallic: true, rgb: ["0.287", "0.521", "0.546", 1], ref: "BiscayBlueMetallic", category: 4, hsl: [0.516, 0.31, 0.417], }, { name: "Blue Metallic", hex: "#2B66A3", metallic: true, rgb: ["0.024", "0.133", "0.366", 1], ref: "BlueMetallic", category: 4, hsl: [0.614, 0.876, 0.195], }, { name: "Blue Turquoise", hex: "#2BA4F1", metallic: false, rgb: ["0.024", "0.371", "0.880", 1], ref: "BlueTurquoise", category: 4, hsl: [0.599, 0.947, 0.452], }, { name: "Clubblau", hex: "#0075E1", metallic: false, rgb: ["0.000", "0.178", "0.753", 1], ref: "ClubBlau", category: 4, hsl: [0.627, 1, 0.376], code: "W60", }, { name: "Cobaltbluemetallic", hex: "#114A97", metallic: true, rgb: ["0.006", "0.068", "0.309", 1], ref: "CobaltBlueMetallic", category: 4, hsl: [0.632, 0.964, 0.158], code: "3C8", }, { name: "Copenhagen Blue", hex: "#38587D", metallic: false, rgb: ["0.040", "0.098", "0.205", 1], ref: "CopenhagenBlue", category: 4, hsl: [0.608, 0.677, 0.122], }, { name: "Coppa Florio Blue", hex: "#B4E2F7", metallic: false, rgb: ["0.456", "0.761", "0.930", 1], ref: "Coppa Florio Blue", category: 4, hsl: [0.56, 0.772, 0.693], }, { name: "Crystal Blue", hex: "#A6E9EF", metallic: false, rgb: ["0.381", "0.815", "0.863", 1], ref: "CrystalBlue", category: 4, hsl: [0.517, 0.638, 0.622], }, { name: "Dalmatian Blue (Oxford Blue)", hex: "#212188", metallic: false, rgb: ["0.015", "0.015", "0.246", 1], ref: "DalmatianBlue", category: 4, hsl: [0.667, 0.884, 0.131], }, { name: "Dark Blue", hex: "#143754", metallic: false, rgb: ["0.007", "0.038", "0.089", 1], ref: "DarkBlue", category: 4, hsl: [0.603, 0.854, 0.048], }, { name: "Darkbluemetallic", hex: "#2C5863", metallic: true, rgb: ["0.025", "0.098", "0.125", 1], ref: "DarkBlue Metallic", category: 4, hsl: [0.545, 0.664, 0.075], code: "M5X", }, { name: "Darkseablue", hex: "#111537", metallic: false, rgb: ["0.006", "0.007", "0.038", 1], ref: "DarkSeaBlue", category: 4, hsl: [0.657, 0.744, 0.022], code: "A5G", }, { name: "Diamond Blue Metallic", hex: "#DFE1F1", metallic: true, rgb: ["0.738", "0.753", "0.880", 1], ref: "DiamondBlueMetallic", category: 4, hsl: [0.649, 0.371, 0.809], }, { name: "Dove Blue Metallic", hex: "#30486C", metallic: true, rgb: ["0.030", "0.065", "0.150", 1], ref: "DoveBlue Metallic", category: 4, hsl: [0.618, 0.671, 0.09], }, { name: "Estoril Blue Metallic", hex: "#3895D0", metallic: true, rgb: ["0.040", "0.301", "0.631", 1], ref: "EstorilBlueMetallic", category: 4, hsl: [0.593, 0.882, 0.335], }, { name: "Fountain Blue Metallic", hex: "#CED6FB", metallic: true, rgb: ["0.617", "0.672", "0.965", 1], ref: "FountainBlueMetallic", category: 4, hsl: [0.64, 0.831, 0.791], }, { name: "Geminimetallic", hex: "#507EBD", metallic: true, rgb: ["0.080", "0.209", "0.509", 1], ref: "GeminiBlueMetallic", category: 4, hsl: [0.617, 0.728, 0.295], code: "335", }, { name: "Gentian Blue", hex: "#1A3C91", metallic: false, rgb: ["0.010", "0.045", "0.283", 1], ref: "Gentian Blue", category: 4, hsl: [0.645, 0.93, 0.147], }, { name: "Glacier Blue (Dark)", hex: "#4EBDF1", metallic: false, rgb: ["0.076", "0.509", "0.880", 1], ref: "GlacierBlue", category: 4, hsl: [0.577, 0.841, 0.478], }, { name: "Glacier Blue (Light)", hex: "#E4F0EF", metallic: false, rgb: ["0.776", "0.871", "0.863", 1], ref: "GlacierBlue (Light)", category: 4, hsl: [0.486, 0.271, 0.824], }, { name: "Glacier Metallic", hex: "#C5D9DD", metallic: true, rgb: ["0.558", "0.694", "0.723", 1], ref: "GlacierMetallic", category: 4, hsl: [0.53, 0.229, 0.641], }, { name: "Graphite Blue Metallic", hex: "#3E586A", metallic: true, rgb: ["0.048", "0.098", "0.144", 1], ref: "GraphiteBlueMetallic", category: 4, hsl: [0.581, 0.499, 0.096], }, { name: "Gulf Blue (Dark)", hex: "#1A65BA", metallic: false, rgb: ["0.010", "0.130", "0.491", 1], ref: "GulfBlue (Dark)", category: 4, hsl: [0.625, 0.959, 0.251], }, { name: "Gulf Blue (Light)", hex: "#96D0E5", metallic: false, rgb: ["0.305", "0.631", "0.784", 1], ref: "GulfBlue", category: 4, hsl: [0.553, 0.525, 0.544], }, { name: "Horizon Blue Metallic", hex: "#87B2E8", metallic: true, rgb: ["0.242", "0.445", "0.807", 1], ref: "HorizonBlueMetallic", category: 4, hsl: [0.607, 0.594, 0.525], }, { name: "Ice Blue Metallic", hex: "#A8C3DA", metallic: true, rgb: ["0.392", "0.546", "0.701", 1], ref: "IceBlueMetallic", category: 4, hsl: [0.584, 0.341, 0.546], }, { name: "Ipanema Blue Metallic", hex: "#16ADC8", metallic: true, rgb: ["0.008", "0.418", "0.578", 1], ref: "IpanemaBlueMetallic", category: 4, hsl: [0.547, 0.973, 0.293], }, { name: "Irisbluemetallic", hex: "#9BBACC", metallic: true, rgb: ["0.328", "0.491", "0.604", 1], ref: "IrisBlueMetallic", category: 4, hsl: [0.568, 0.296, 0.466], code: "39V", }, { name: "Iris Blue Pearl", hex: "#0B1A85", metallic: false, rgb: ["0.003", "0.010", "0.235", 1], ref: "IrisBlue", category: 4, hsl: [0.662, 0.972, 0.119], }, { name: "Laguna Blue", hex: "#7DCDE7", metallic: false, rgb: ["0.205", "0.610", "0.799", 1], ref: "LagunaBlue", category: 4, hsl: [0.553, 0.597, 0.502], }, { name: "Lapis Blue", hex: "#091D66", metallic: false, rgb: ["0.003", "0.012", "0.133", 1], ref: "LapisBlue", category: 4, hsl: [0.654, 0.96, 0.068], }, { name: "Light Blue Metallic", hex: "#9DC0CC", metallic: true, rgb: ["0.337", "0.527", "0.604", 1], ref: "LightBlueMetallic", category: 4, hsl: [0.548, 0.283, 0.47], }, { name: "Marathon Blue Metallic", hex: "#AAC2C7", metallic: true, rgb: ["0.402", "0.539", "0.571", 1], ref: "MarathoneBlueMetallic", category: 4, hsl: [0.531, 0.174, 0.487], }, { name: "Marine Blue Metallic", hex: "#4C5167", metallic: true, rgb: ["0.072", "0.082", "0.136", 1], ref: "MarineBlueMetallic", category: 4, hsl: [0.64, 0.305, 0.104], }, { name: "Maritimeblue", hex: "#4B77EA", metallic: false, rgb: ["0.070", "0.184", "0.823", 1], ref: "MaritimeBlue", category: 4, hsl: [0.641, 0.842, 0.447], code: "5MB", }, { name: "Mauritius Blue", hex: "#2D488C", metallic: false, rgb: ["0.026", "0.065", "0.262", 1], ref: "MauritiusBlue", category: 4, hsl: [0.639, 0.818, 0.144], }, { name: "Meissenblue", hex: "#BFD7E2", metallic: false, rgb: ["0.521", "0.680", "0.761", 1], ref: "MeissenBlue", category: 4, hsl: [0.556, 0.333, 0.641], code: "Z54", }, { name: "Metallic Blue", hex: "#277CBD", metallic: true, rgb: ["0.020", "0.202", "0.509", 1], ref: "MetallicBlue", category: 4, hsl: [0.605, 0.923, 0.265], }, { name: "Mexicoblue", hex: "#3DBDED", metallic: false, rgb: ["0.047", "0.509", "0.847", 1], ref: "MexicoBlue", category: 4, hsl: [0.57, 0.896, 0.447], code: "336", }, { name: "Miami Blue", hex: "#1BBFE8", metallic: false, rgb: ["0.011", "0.521", "0.807", 1], ref: "MiamiBlue", category: 4, hsl: [0.56, 0.973, 0.409], }, { name: "Midnight Blue Metallic", hex: "#0B0553", metallic: true, rgb: ["0.003", "0.002", "0.087", 1], ref: "MidnightBlueMetallic", category: 4, hsl: [0.67, 0.966, 0.044], }, { name: "Minerva Blue Metallic", hex: "#1383DA", metallic: true, rgb: ["0.007", "0.227", "0.701", 1], ref: "MinervaBlueMetallic", category: 4, hsl: [0.614, 0.982, 0.354], }, { name: "Monaco Blue", hex: "#5781BA", metallic: false, rgb: ["0.095", "0.220", "0.491", 1], ref: "MonocoBlue", category: 4, hsl: [0.614, 0.675, 0.293], }, { name: "Moonlightbluemetallic", hex: "#282A47", metallic: true, rgb: ["0.021", "0.023", "0.063", 1], ref: "MoonlightBluePearl", category: 4, hsl: [0.659, 0.496, 0.042], code: "C5M", }, { name: "Nautic (Ocean) Blue Metallic", hex: "#16335B", metallic: true, rgb: ["0.008", "0.033", "0.105", 1], ref: "NauticMetallic", category: 4, hsl: [0.623, 0.858, 0.056], }, { name: "Night Blue Metallic", hex: "#0B3753", metallic: true, rgb: ["0.003", "0.038", "0.087", 1], ref: "NightBlue", category: 4, hsl: [0.597, 0.926, 0.045], }, { name: "Oceanbluemetallic", hex: "#142276", metallic: true, rgb: ["0.007", "0.016", "0.181", 1], ref: "OceanBlue Metallic ", category: 4, hsl: [0.658, 0.926, 0.094], code: "3AZ", }, { name: "Olympicblue", hex: "#64CAF5", metallic: false, rgb: ["0.127", "0.591", "0.913", 1], ref: "OlympicBlue", category: 4, hsl: [0.568, 0.819, 0.52], code: "Z16", }, { name: "Osloblue", hex: "#2E7FC3", metallic: false, rgb: ["0.027", "0.212", "0.546", 1], ref: "OsloBlue", category: 4, hsl: [0.607, 0.905, 0.287], code: "Z77", }, { name: "Ossi Blue", hex: "#1C4CAE", metallic: false, rgb: ["0.012", "0.072", "0.423", 1], ref: "OssiBlue", category: 4, hsl: [0.642, 0.947, 0.217], }, { name: "Pacific Blue Metallic", hex: "#375975", metallic: true, rgb: ["0.038", "0.100", "0.178", 1], ref: "PacificBlueMetallic", category: 4, hsl: [0.593, 0.646, 0.108], }, { name: "Pastel Blue", hex: "#4DB3ED", metallic: false, rgb: ["0.074", "0.451", "0.847", 1], ref: "PastelBlue", category: 4, hsl: [0.585, 0.839, 0.461], }, { name: "Petrol Blue Metallic", hex: "#0F647D", metallic: true, rgb: ["0.005", "0.127", "0.205", 1], ref: "PetrolBlueMetallic", category: 4, hsl: [0.565, 0.954, 0.105], }, { name: "Prussian Blue Metallic", hex: "#112A57", metallic: true, rgb: ["0.006", "0.023", "0.095", 1], ref: "PrussianBlueMetallic", category: 4, hsl: [0.634, 0.889, 0.05], }, { name: "Pure Blue", hex: "#104EAA", metallic: false, rgb: ["0.005", "0.076", "0.402", 1], ref: "PureBlue", category: 4, hsl: [0.637, 0.975, 0.204], }, { name: "Rivierablue", hex: "#359BD0", metallic: false, rgb: ["0.036", "0.328", "0.631", 1], ref: "RivieraBlue", category: 4, hsl: [0.585, 0.893, 0.333], code: "39E", }, { name: "Royal Blue", hex: "#0C5E98", metallic: false, rgb: ["0.004", "0.112", "0.314", 1], ref: "RoyalBlue", category: 4, hsl: [0.609, 0.977, 0.159], }, { name: "Sapphire Blue Metallic", hex: "#092F85", metallic: true, rgb: ["0.003", "0.028", "0.235", 1], ref: "SapphireBlueMetallic", category: 4, hsl: [0.648, 0.977, 0.119], }, { name: "Shark Blue", hex: "#0050AA", metallic: false, rgb: ["0.000", "0.080", "0.402", 1], ref: "SharkBlue", category: 4, hsl: [0.633, 1, 0.201], }, { name: "Sky Blue", hex: "#4297C8", metallic: false, rgb: ["0.054", "0.309", "0.578", 1], ref: "SkyBlue", category: 4, hsl: [0.585, 0.828, 0.316], }, { name: "Slate Blue Metallic", hex: "#70849F", metallic: true, rgb: ["0.162", "0.231", "0.347", 1], ref: "SlateBlueMetallic", category: 4, hsl: [0.605, 0.363, 0.254], }, { name: "Speedster Blue", hex: "#1168B3", metallic: false, rgb: ["0.006", "0.138", "0.451", 1], ref: "SpeedsterBlue", category: 4, hsl: [0.617, 0.975, 0.228], }, { name: "Tahoe Blue Metallic", hex: "#2A87C8", metallic: true, rgb: ["0.023", "0.242", "0.578", 1], ref: "TahoeBlueMetallic", category: 4, hsl: [0.601, 0.923, 0.3], }, { name: "Teal Blue Metallic", hex: "#2146B1", metallic: true, rgb: ["0.015", "0.061", "0.440", 1], ref: "TealBlueMetallic", category: 4, hsl: [0.649, 0.933, 0.227], }, { name: "Turquoise", hex: "#72C7CE", metallic: false, rgb: ["0.168", "0.571", "0.617", 1], ref: "Turquoise", category: 4, hsl: [0.517, 0.572, 0.393], }, { name: "Ultra Blue", hex: "#296D9C", metallic: false, rgb: ["0.022", "0.153", "0.332", 1], ref: "UltraBlue", category: 4, hsl: [0.596, 0.875, 0.177], }, { name: "Venetian Blue Metallic", hex: "#054468", metallic: true, rgb: ["0.002", "0.058", "0.138", 1], ref: "VenetianBlueMetallic", category: 4, hsl: [0.598, 0.978, 0.07], }, { name: "Venice Blue Metallic", hex: "#8A9FAA", metallic: true, rgb: ["0.254", "0.347", "0.402", 1], ref: "VeniceBlue Metallic", category: 4, hsl: [0.562, 0.225, 0.328], }, { name: "Voodooblue", hex: "#2982E0", metallic: false, rgb: ["0.022", "0.223", "0.745", 1], ref: "Voodoo Blue", category: 4, hsl: [0.62, 0.942, 0.384], code: "5VL", }, { name: "Yachtingbluemetallic", hex: "#245E8A", metallic: true, rgb: ["0.018", "0.112", "0.254", 1], ref: "YatchingBlueMetallic", category: 4, hsl: [0.6, 0.87, 0.136], code: "M5S", }, { name: "Zenith Blue Metallic", hex: "#565DB0", metallic: true, rgb: ["0.093", "0.109", "0.434", 1], ref: "ZenithBlueMetallic", category: 4, hsl: [0.659, 0.647, 0.264], }, { name: "Amaranth Violet", hex: "#764283", metallic: false, rgb: ["0.181", "0.054", "0.227", 1], ref: "AmaranthViolet", category: 5, hsl: [0.789, 0.613, 0.141], }, { name: "Amethystmetallic", hex: "#56032E", metallic: true, rgb: ["0.093", "0.001", "0.027", 1], ref: "MetallicAmethyst", category: 5, hsl: [0.952, 0.981, 0.047], code: "M4Z", }, { name: "Amethyst Pearl", hex: "#230615", metallic: false, rgb: ["0.017", "0.002", "0.007", 1], ref: "AmethystPearl Effect", category: 5, hsl: [0.937, 0.804, 0.009], }, { name: "Aubergine", hex: "#66093E", metallic: false, rgb: ["0.133", "0.003", "0.048", 1], ref: "Aubergine", category: 5, hsl: [0.942, 0.96, 0.068], }, { name: "Moonstone (Lilac)", hex: "#E9E0EA", metallic: false, rgb: ["0.815", "0.745", "0.823", 1], ref: "Moonstone", category: 5, hsl: [0.816, 0.179, 0.784], }, { name: "Purpurite", hex: "#231939", metallic: false, rgb: ["0.017", "0.010", "0.041", 1], ref: "Purpurite", category: 5, hsl: [0.705, 0.616, 0.025], }, { name: "Royal Purple (Lilac)", hex: "#5D3F6C", metallic: false, rgb: ["0.109", "0.050", "0.150", 1], ref: "RoyalPurple(Lilac)", category: 5, hsl: [0.766, 0.502, 0.1], }, { name: "Ultraviolet", hex: "#62416B", metallic: false, rgb: ["0.122", "0.053", "0.147", 1], ref: "Ultraviolet", category: 5, hsl: [0.789, 0.471, 0.1], code: "M4A", }, { name: "Vesuvio Metallic", hex: "#554351", metallic: true, rgb: ["0.091", "0.056", "0.082", 1], ref: "VesuvioMetallic", category: 5, hsl: [0.874, 0.236, 0.073], }, { name: "Violametallic", hex: "#170424", metallic: true, rgb: ["0.009", "0.001", "0.018", 1], ref: "ViolaMetallic", category: 5, hsl: [0.741, 0.871, 0.009], code: "4VN", }, { name: "Violet Blue Metallic", hex: "#A478C6", metallic: true, rgb: ["0.371", "0.188", "0.565", 1], ref: "VioletBlueMetallic", category: 5, hsl: [0.748, 0.501, 0.376], }, { name: "Almond Beige Metallic", hex: "#D1BCA8", metallic: true, rgb: ["0.638", "0.503", "0.392", 1], ref: "AlmondBeigeMetallic", category: 6, hsl: [0.075, 0.253, 0.515], }, { name: "Alpine White", hex: "#F6F6F6", metallic: false, rgb: ["0.922", "0.922", "0.922", 1], ref: "AlpineWhite", category: 6, hsl: [0, 0, 0.922], }, { name: "Apricot Beige", hex: "#F0DCC9", metallic: false, rgb: ["0.871", "0.716", "0.584", 1], ref: "ApricotBeige", category: 6, hsl: [0.076, 0.528, 0.728], }, { name: "Bamboo Beige", hex: "#F8E1B2", metallic: false, rgb: ["0.939", "0.753", "0.445", 1], ref: "BambooBeige", category: 6, hsl: [0.104, 0.801, 0.692], }, { name: "Bamboo Metallic", hex: "#D6CCBB", metallic: true, rgb: ["0.672", "0.604", "0.497", 1], ref: "BambooMetallic", category: 6, hsl: [0.102, 0.211, 0.585], }, { name: "Beige Grey", hex: "#DEDECC", metallic: false, rgb: ["0.730", "0.730", "0.604", 1], ref: "BeigeGrey", category: 6, hsl: [0.167, 0.19, 0.667], }, { name: "Biarritz White", hex: "#F9F7F7", metallic: false, rgb: ["0.947", "0.930", "0.930", 1], ref: "BiarritzWhite", category: 6, hsl: [0, 0.14, 0.939], }, { name: "Carrara White", hex: "#EAEAEA", metallic: false, rgb: ["0.823", "0.823", "0.823", 1], ref: "CarraraWhite", category: 6, hsl: [0, 0, 0.823], }, { name: "Carrara White Metallic", hex: "#FFFFFF", metallic: true, rgb: ["1.000", "1.000", "1.000", 1], ref: "CarraraWhite Metallic", category: 6, hsl: [0, 0, 1], }, { name: "Casablanca Beige Metallic", hex: "#DDBA6F", metallic: true, rgb: ["0.723", "0.491", "0.159", 1], ref: "CasablancaBeigeMetallic", category: 6, hsl: [0.098, 0.64, 0.441], }, { name: "Cashmere Beige", hex: "#D29C5C", metallic: false, rgb: ["0.644", "0.332", "0.107", 1], ref: "CashmereBeige", category: 6, hsl: [0.07, 0.715, 0.376], }, { name: "Ceramic (Caramel) Beige", hex: "#DEB28A", metallic: false, rgb: ["0.730", "0.445", "0.254", 1], ref: "CeramicBeige", category: 6, hsl: [0.067, 0.484, 0.492], }, { name: "Chiffon White", hex: "#F0EFE3", metallic: false, rgb: ["0.871", "0.863", "0.768", 1], ref: "ChiffonWhite", category: 6, hsl: [0.153, 0.286, 0.82], }, { name: "Cremewhite", hex: "#F4F4F0", metallic: false, rgb: ["0.905", "0.905", "0.871", 1], ref: "CreamWhite", category: 6, hsl: [0.167, 0.149, 0.888], code: "51A", }, { name: "Flamingo Metallic", hex: "#E1DDC7", metallic: true, rgb: ["0.753", "0.723", "0.571", 1], ref: "FlamingoMetallic", category: 6, hsl: [0.139, 0.269, 0.662], }, { name: "Glacier White (Modern)", hex: "#F9F9F9", metallic: false, rgb: ["0.947", "0.947", "0.947", 1], ref: "GlacierWhite", category: 6, hsl: [0, 0, 0.947], }, { name: "Glacier White (Vintage)", hex: "#D5E4BE", metallic: false, rgb: ["0.665", "0.776", "0.515", 1], ref: "GlacierWhite (Vintage)", category: 6, hsl: [0.237, 0.368, 0.645], }, { name: "Grand Prix White", hex: "#FBFFFF", metallic: false, rgb: ["0.965", "1.000", "1.000", 1], ref: "GrandPrixWhite", category: 6, hsl: [0.5, 1, 0.982], }, { name: "Ivory", hex: "#E2E2D7", metallic: false, rgb: ["0.761", "0.761", "0.680", 1], ref: "Ivory", category: 6, hsl: [0.167, 0.145, 0.72], code: "Z55", }, { name: "Jarama Beige", hex: "#AD9A7B", metallic: false, rgb: ["0.418", "0.323", "0.198", 1], ref: "JaramaBeige", category: 6, hsl: [0.095, 0.357, 0.308], }, { name: "Kalahari Beige Metallic", hex: "#D5D4B6", metallic: true, rgb: ["0.665", "0.658", "0.468", 1], ref: "KalahariBeige Metallic", category: 6, hsl: [0.161, 0.228, 0.567], }, { name: "Lightivory", hex: "#F0F0F0", metallic: false, rgb: ["0.871", "0.871", "0.871", 1], ref: "LightIvory", category: 6, hsl: [0, 0, 0.871], code: "Y09", }, { name: "Luxor Beige Metallic", hex: "#7B694C", metallic: true, rgb: ["0.198", "0.141", "0.072", 1], ref: "LuxorBeigeMetallic", category: 6, hsl: [0.091, 0.465, 0.135], }, { name: "Medium Ivory", hex: "#F1F2E5", metallic: false, rgb: ["0.880", "0.888", "0.784", 1], ref: "MediumIvory", category: 6, hsl: [0.18, 0.318, 0.836], }, { name: "Mexico Beige", hex: "#E8D3AB", metallic: false, rgb: ["0.807", "0.651", "0.407", 1], ref: "MexicoBeige", category: 6, hsl: [0.102, 0.509, 0.607], }, { name: "Opal Metallic", hex: "#C2B378", metallic: true, rgb: ["0.539", "0.451", "0.188", 1], ref: "OpalMetallic", category: 6, hsl: [0.125, 0.484, 0.364], }, { name: "Oryx White Pearl", hex: "#F2F2F2", metallic: false, rgb: ["0.888", "0.888", "0.888", 1], ref: "OryxWhite Pearl", category: 6, hsl: [0, 0, 0.888], }, { name: "Pastel Beige", hex: "#FAF6EB", metallic: false, rgb: ["0.956", "0.922", "0.831", 1], ref: "PastelBeige", category: 6, hsl: [0.121, 0.587, 0.893], }, { name: "Pearl White Metallic", hex: "#F2F2EE", metallic: true, rgb: ["0.888", "0.888", "0.855", 1], ref: "PearlWhite Metallic", category: 6, hsl: [0.167, 0.128, 0.871], }, { name: "Polar White", hex: "#F1F5F6", metallic: false, rgb: ["0.880", "0.913", "0.922", 1], ref: "PolarWhite", category: 6, hsl: [0.534, 0.211, 0.901], }, { name: "Pure White", hex: "#FFFFFF", metallic: false, rgb: ["1.000", "1.000", "1.000", 1], ref: "PureWhite", category: 6, hsl: [0, 0, 1], }, { name: "Sahara Beige", hex: "#FEEAAC", metallic: false, rgb: ["0.991", "0.823", "0.413", 1], ref: "SaharaBeige", category: 6, hsl: [0.118, 0.97, 0.702], }, { name: "Sand Beige", hex: "#D8C193", metallic: false, rgb: ["0.687", "0.533", "0.292", 1], ref: "SandBeige", category: 6, hsl: [0.102, 0.404, 0.489], }, { name: "Sand White", hex: "#F6F4F4", metallic: false, rgb: ["0.922", "0.905", "0.905", 1], ref: "SandWhite", category: 6, hsl: [0, 0.097, 0.913], }, { name: "White", hex: "#FFFFFF", metallic: false, rgb: ["1.000", "1.000", "1.000", 1], ref: "White", category: 6, hsl: [0, 0, 1], }, { name: "Agate Grey Metallic", hex: "#5A5A5A", metallic: true, rgb: ["0.102", "0.102", "0.102", 1], ref: "AgateGreyMetallic", category: 7, hsl: [0, 0, 0.102], }, { name: "Arctic Silver Metallic", hex: "#E1E1E1", metallic: true, rgb: ["0.753", "0.753", "0.753", 1], ref: "ArcticSilverMetallic", category: 7, hsl: [0, 0, 0.753], }, { name: "Atlas Grey Metallic", hex: "#535353", metallic: true, rgb: ["0.087", "0.087", "0.087", 1], ref: "AtlasGreyMetallic", category: 7, hsl: [0, 0, 0.087], }, { name: "Aztec Silver", hex: "#DEDCDA", metallic: false, rgb: ["0.730", "0.716", "0.701", 1], ref: "AztecSilver", category: 7, hsl: [0.083, 0.052, 0.716], }, { name: "Carbongreymetallic", hex: "#6F6D69", metallic: true, rgb: ["0.159", "0.153", "0.141", 1], ref: "CarbonGrey Metallic", category: 7, hsl: [0.11, 0.059, 0.15], code: "M9Z", }, { name: "Chalk", hex: "#E1DEDE", metallic: false, rgb: ["0.753", "0.730", "0.730", 1], ref: "Chalk", category: 7, hsl: [0, 0.044, 0.742], }, { name: "Crystal Silver", hex: "#E6E8E8", metallic: false, rgb: ["0.791", "0.807", "0.807", 1], ref: "CrystalSilver", category: 7, hsl: [0.5, 0.039, 0.799], }, { name: "Crystal Silver Metallic", hex: "#E9E9E7", metallic: true, rgb: ["0.815", "0.815", "0.799", 1], ref: "CrystalSilver Metallic", category: 7, hsl: [0.167, 0.041, 0.807], }, { name: "Diamond Silver Metallic", hex: "#D3D3D3", metallic: true, rgb: ["0.651", "0.651", "0.651", 1], ref: "DiamondSilverMetallic", category: 7, hsl: [0, 0, 0.651], }, { name: "Dolomite Grey Metallic", hex: "#4C4136", metallic: true, rgb: ["0.072", "0.053", "0.037", 1], ref: "DolomiteGrey Metallic", category: 7, hsl: [0.075, 0.324, 0.055], }, { name: "Dolphin Gray", hex: "#E1EAE8", metallic: false, rgb: ["0.753", "0.823", "0.807", 1], ref: "DolphinGray", category: 7, hsl: [0.462, 0.165, 0.788], }, { name: "Dolphingrey", hex: "#E3E9EB", metallic: false, rgb: ["0.768", "0.815", "0.831", 1], ref: "DolphinGrey", category: 7, hsl: [0.542, 0.156, 0.799], code: "W07", }, { name: "Fashiongrey", hex: "#CDD0D1", metallic: false, rgb: ["0.610", "0.631", "0.638", 1], ref: "FashionGray", category: 7, hsl: [0.542, 0.036, 0.624], code: "7MG", }, { name: "Fish Silver Grey", hex: "#AABECF", metallic: false, rgb: ["0.402", "0.515", "0.624", 1], ref: "FishSilverGrey", category: 7, hsl: [0.582, 0.228, 0.513], }, { name: "GT Silver", hex: "#EFF0F0", metallic: false, rgb: ["0.863", "0.871", "0.871", 1], ref: "GTSilver", category: 7, hsl: [0.5, 0.031, 0.867], }, { name: "GT Silver Metallic", hex: "#E0E0E0", metallic: true, rgb: ["0.745", "0.745", "0.745", 1], ref: "GTSilverMetallic", category: 7, hsl: [0, 0, 0.745], }, { name: "Gazelle Metallic", hex: "#D8CEAD", metallic: true, rgb: ["0.687", "0.617", "0.418", 1], ref: "GazelleMetallic", category: 7, hsl: [0.124, 0.3, 0.552], }, { name: "Gemini Grey Metallic", hex: "#9AA3A9", metallic: true, rgb: ["0.323", "0.366", "0.397", 1], ref: "GeminiGreyMetallic", category: 7, hsl: [0.569, 0.102, 0.36], }, { name: "Geyser Grey", hex: "#D7D4C8", metallic: false, rgb: ["0.680", "0.658", "0.578", 1], ref: "Geyser Grey", category: 7, hsl: [0.132, 0.137, 0.629], }, { name: "Graphitegrey", hex: "#454341", metallic: false, rgb: ["0.060", "0.056", "0.053", 1], ref: "Graphite Grey", category: 7, hsl: [0.082, 0.059, 0.056], code: "7B2", }, { name: "Graphite Grey Metallic", hex: "#797979", metallic: true, rgb: ["0.191", "0.191", "0.191", 1], ref: "GraphiteGreyMetallic", category: 7, hsl: [0, 0, 0.191], }, { name: "Graphite Metallic", hex: "#BEBEBE", metallic: true, rgb: ["0.515", "0.515", "0.515", 1], ref: "GraphiteMetallic", category: 7, hsl: [0, 0, 0.515], }, { name: "Greyblack", hex: "#464242", metallic: false, rgb: ["0.061", "0.054", "0.054", 1], ref: "GreyBlack", category: 7, hsl: [0, 0.058, 0.058], code: "7GS", }, { name: "Grigio Telesto Pearl", hex: "#B5BABC", metallic: false, rgb: ["0.462", "0.491", "0.503", 1], ref: "GrigioTelestoPearl", category: 7, hsl: [0.548, 0.042, 0.482], }, { name: "Heron Grey", hex: "#E9E9E4", metallic: false, rgb: ["0.815", "0.815", "0.776", 1], ref: "HeronGrey", category: 7, hsl: [0.167, 0.095, 0.795], }, { name: "Ice Grey Metallic", hex: "#dfe2e8", metallic: false, rgb: ["0.738", "0.761", "0.807", 1], ref: "Ice Grey Metallic", category: 7, hsl: [0.457, 0.13, 0.673], }, { name: "Linen Grey", hex: "#DBDAC7", metallic: false, rgb: ["0.708", "0.701", "0.571", 1], ref: "LinenGrey", category: 7, hsl: [0.158, 0.19, 0.64], }, { name: "Linen Grey Metallic", hex: "#E4E4D6", metallic: true, rgb: ["0.776", "0.776", "0.672", 1], ref: "LinenGreyMetallic", category: 7, hsl: [0.167, 0.187, 0.724], }, { name: "Linen Metallic", hex: "#F3F3D7", metallic: true, rgb: ["0.896", "0.896", "0.680", 1], ref: "LinenMetallic", category: 7, hsl: [0.167, 0.511, 0.788], }, { name: "Marble Grey", hex: "#E6E6E3", metallic: false, rgb: ["0.791", "0.791", "0.768", 1], ref: "MarbleGrey", category: 7, hsl: [0.167, 0.053, 0.78], }, { name: "Meridian Metallic", hex: "#C6C2B4", metallic: true, rgb: ["0.565", "0.539", "0.456", 1], ref: "MeridianMetallic", category: 7, hsl: [0.128, 0.111, 0.511], }, { name: "Meteor Grey Metallic", hex: "#2D2D2D", metallic: true, rgb: ["0.026", "0.026", "0.026", 1], ref: "MeteorGreyMetallic", category: 7, hsl: [0, 0, 0.026], }, { name: "Meteor Metallic", hex: "#2D2B2B", metallic: true, rgb: ["0.026", "0.024", "0.024", 1], ref: "MeteorMetallic", category: 7, hsl: [0, 0.041, 0.025], }, { name: "Palladiummetallic", hex: "#E0CFB3", metallic: true, rgb: ["0.745", "0.624", "0.451", 1], ref: "PalladiumMetallic", category: 7, hsl: [0.098, 0.367, 0.598], code: "C1Y", }, { name: "Pearl Grey", hex: "#E3E4E9", metallic: false, rgb: ["0.768", "0.776", "0.815", 1], ref: "PearlGrey", category: 7, hsl: [0.639, 0.112, 0.791], }, { name: "Pewter Metallic", hex: "#D3D6D7", metallic: true, rgb: ["0.651", "0.672", "0.680", 1], ref: "PewterMetallic", category: 7, hsl: [0.542, 0.042, 0.665], }, { name: "Platinum Metallic", hex: "#838272", metallic: true, rgb: ["0.227", "0.223", "0.168", 1], ref: "PlatinumMetallic", category: 7, hsl: [0.156, 0.149, 0.198], }, { name: "Platinum Silver Metallic", hex: "#AFAFA2", metallic: true, rgb: ["0.429", "0.429", "0.361", 1], ref: "PlatinumSilver", category: 7, hsl: [0.167, 0.085, 0.395], }, { name: "Polar Silver", hex: "#CCCCCC", metallic: false, rgb: ["0.604", "0.604", "0.604", 1], ref: "PolarSilver", category: 7, hsl: [0, 0, 0.604], }, { name: "Quartz Grey Metallic", hex: "#5D5D58", metallic: true, rgb: ["0.109", "0.109", "0.098", 1], ref: "QuartzGreyMetallic", category: 7, hsl: [0.167, 0.057, 0.104], }, { name: "Quartzite Grey Metallic\t", hex: "#879586", metallic: true, rgb: ["0.242", "0.301", "0.238", 1], ref: "QuartziteGreyMetallic", category: 7, hsl: [0.323, 0.115, 0.269], }, { name: "Rhodium Silver", hex: "#C8CDDB", metallic: false, rgb: ["0.578", "0.610", "0.708", 1], ref: "RhodiumSilver", category: 7, hsl: [0.625, 0.183, 0.643], }, { name: "Sand Grey", hex: "#DEDEDD", metallic: false, rgb: ["0.730", "0.730", "0.723", 1], ref: "SandGrey", category: 7, hsl: [0.167, 0.014, 0.727], }, { name: "Sapphire Metallic", hex: "#BEBEBE", metallic: true, rgb: ["0.515", "0.515", "0.515", 1], ref: "SapphireMetallic", category: 7, hsl: [0, 0, 0.515], }, { name: "Seal Grey Metallic", hex: "#474343", metallic: true, rgb: ["0.063", "0.056", "0.056", 1], ref: "SealGreyMetallic", category: 7, hsl: [0, 0.058, 0.06], }, { name: "Silver", hex: "#F1F1F1", metallic: false, rgb: ["0.880", "0.880", "0.880", 1], ref: "Silver", category: 7, hsl: [0, 0, 0.88], }, { name: "Silver Metallic", hex: "#E9E9E9", metallic: true, rgb: ["0.815", "0.815", "0.815", 1], ref: "SilverMetallic", category: 7, hsl: [0, 0, 0.815], }, { name: "Silver Rose", hex: "#F6E7E7", metallic: false, rgb: ["0.922", "0.799", "0.799", 1], ref: "SilverRose", category: 7, hsl: [0, 0.438, 0.86], }, { name: "Slate Grey", hex: "#707070", metallic: false, rgb: ["0.162", "0.162", "0.162", 1], ref: "SlateGrey", category: 7, hsl: [0, 0, 0.162], }, { name: "Slate Grey Metallic", hex: "#707070", metallic: true, rgb: ["0.162", "0.162", "0.162", 1], ref: "SlateGreyMetallic", category: 7, hsl: [0, 0, 0.162], }, { name: "Sportclassicgrey", hex: "#DAE1E1", metallic: false, rgb: ["0.701", "0.753", "0.753", 1], ref: "SportsClassicGrey", category: 7, hsl: [0.5, 0.095, 0.727], code: "63A", }, { name: "Stonegrey", hex: "#C2BE81", metallic: false, rgb: ["0.539", "0.515", "0.220", 1], ref: "StoneGrey", category: 7, hsl: [0.154, 0.422, 0.38], code: "Z67", }, { name: "Stonegreymetallic", hex: "#B5BCBF", metallic: true, rgb: ["0.462", "0.503", "0.521", 1], ref: "StoneGreyMetallic", category: 7, hsl: [0.551, 0.06, 0.492], code: "7SG", }, { name: "Tin (Zinc) Metallic", hex: "#E5E5E5", metallic: true, rgb: ["0.784", "0.784", "0.784", 1], ref: "ZincMetallic", category: 7, hsl: [0, 0, 0.784], }, { name: "Titan Metallic", hex: "#6A6161", metallic: true, rgb: ["0.144", "0.120", "0.120", 1], ref: "TitanMetallic", category: 7, hsl: [0, 0.093, 0.132], }, { name: "Titanium", hex: "#504F4F", metallic: false, rgb: ["0.080", "0.078", "0.078", 1], ref: "Titanium", category: 7, hsl: [0, 0.013, 0.079], }, { name: "Umbra Metallic", hex: "#CECCCC", metallic: true, rgb: ["0.617", "0.604", "0.604", 1], ref: "UmbraMetallic", category: 7, hsl: [0, 0.017, 0.611], }, { name: "Volcanogreymetallic", hex: "#444343", metallic: true, rgb: ["0.058", "0.056", "0.056", 1], ref: "VolcanoGreyMetallic", category: 7, hsl: [0, 0.015, 0.057], code: "M7R", }, { name: "Zermatt Silver", hex: "#F4F8F4", metallic: false, rgb: ["0.905", "0.939", "0.905", 1], ref: "ZermattSilver", category: 7, hsl: [0.333, 0.217, 0.922], }, { name: "Zermatt Silver Metallic", hex: "#EBEAE1", metallic: true, rgb: ["0.831", "0.823", "0.753", 1], ref: "ZermattSilverMetallic", category: 7, hsl: [0.15, 0.187, 0.792], }, { name: "Basalt Black", hex: "#240606", metallic: false, rgb: ["0.018", "0.002", "0.002", 1], ref: "basaltblack", category: 8, hsl: [0, 0.813, 0.01], }, { name: "Basaltblackmetallic", hex: "#03071A", metallic: true, rgb: ["0.001", "0.002", "0.010", 1], ref: "BasaltBlackMetallic", category: 8, hsl: [0.645, 0.838, 0.006], code: "C9Z", }, { name: "Black", hex: "#000000", metallic: false, rgb: ["0.000", "0.000", "0.000", 1], ref: "Black", category: 8, hsl: [0, 0, 0], }, { name: "Black Metallic", hex: "#0F0E0E", metallic: true, rgb: ["0.005", "0.004", "0.004", 1], ref: "BlackMetallic", category: 8, hsl: [0, 0.042, 0.005], }, { name: "Black Pearl", hex: "#0B0101", metallic: false, rgb: ["0.003", "0.000", "0.000", 1], ref: "BlackPearl", category: 8, hsl: [0, 0.834, 0.002], }, { name: "Brilliant Black", hex: "#0E0101", metallic: false, rgb: ["0.004", "0.000", "0.000", 1], ref: "BrilliantBlack", category: 8, hsl: [0, 0.871, 0.002], }, { name: "Carbonblackmetallic", hex: "#262525", metallic: true, rgb: ["0.019", "0.019", "0.019", 1], ref: "CarbonBlackMetallic", category: 8, hsl: [0, 0.023, 0.019], code: "7C3", }, { name: "Jet Black Metallic", hex: "#211B1B", metallic: true, rgb: ["0.015", "0.011", "0.011", 1], ref: "JetBlack Metallic", category: 8, hsl: [0, 0.162, 0.013], }, { name: "LE Bumble Bee", hex: "#030301", metallic: false, rgb: ["0.001", "0.001", "0.000", 1], ref: "LEBumbleBee", category: 8, hsl: [0.167, 0.5, 0.001], }, { name: "Panthero Metallic", hex: "#373737", metallic: true, rgb: ["0.038", "0.038", "0.038", 1], ref: "PantheroMetallic", category: 8, hsl: [0, 0, 0.038], }, { name: "Satin Black Metallic", hex: "#000000", metallic: true, rgb: ["0.000", "0.000", "0.000", 1], ref: "SatinBlack Metallic", category: 8, hsl: [0, 0, 0], }, { name: "Anthracitebrownmetallic", hex: "#322E2C", metallic: true, rgb: ["0.032", "0.027", "0.025", 1], ref: "AnthraciteBrownMetallic", category: 9, hsl: [0.053, 0.118, 0.029], code: "M8S", }, { name: "Bitter Chocolate (Cockney Brown)", hex: "#A3580D", metallic: false, rgb: ["0.366", "0.098", "0.004", 1], ref: "BitterChocolate", category: 9, hsl: [0.043, 0.978, 0.185], }, { name: "Caramel Brown", hex: "#D6925B", metallic: false, rgb: ["0.672", "0.287", "0.105", 1], ref: "CaramelBrown", category: 9, hsl: [0.054, 0.731, 0.389], }, { name: "Chocolate Brown", hex: "#261105", metallic: false, rgb: ["0.019", "0.006", "0.002", 1], ref: "ChocolateBrown", category: 9, hsl: [0.038, 0.855, 0.01], }, { name: "Coffee (Cocoa) Brown", hex: "#412810", metallic: false, rgb: ["0.053", "0.021", "0.005", 1], ref: "CoffeeBrown", category: 9, hsl: [0.056, 0.821, 0.029], }, { name: "Cognac Brown Metallic ", hex: "#824C20", metallic: true, rgb: ["0.223", "0.072", "0.014", 1], ref: "CognacBrown Metallic ", category: 9, hsl: [0.046, 0.878, 0.119], }, { name: "Cognacmetallic", hex: "#C3926E", metallic: true, rgb: ["0.546", "0.287", "0.156", 1], ref: "CognacMetallic", category: 9, hsl: [0.056, 0.556, 0.351], code: "M8Z", }, { name: "Copper Bronze Metallic", hex: "#BBAB99", metallic: true, rgb: ["0.497", "0.407", "0.319", 1], ref: "CopperBronze Metallic", category: 9, hsl: [0.083, 0.219, 0.408], }, { name: "Copper Brown Metallic", hex: "#745330", metallic: true, rgb: ["0.175", "0.087", "0.030", 1], ref: "CopperBrownMetallic", category: 9, hsl: [0.065, 0.711, 0.102], }, { name: "Coral Metallic", hex: "#DB8B5F", metallic: true, rgb: ["0.708", "0.258", "0.114", 1], ref: "CoralMetallic", category: 9, hsl: [0.04, 0.722, 0.411], }, { name: "Espresso Brown Metallic", hex: "#2F2214", metallic: true, rgb: ["0.028", "0.016", "0.007", 1], ref: "EspressoBrownMetallic", category: 9, hsl: [0.07, 0.605, 0.018], }, { name: "Macadamiametallic", hex: "#3D2A24", metallic: true, rgb: ["0.047", "0.023", "0.018", 1], ref: "MacadamiaMetallic", category: 9, hsl: [0.032, 0.451, 0.032], code: "M8W", }, { name: "Mahogany Brown Metallic ", hex: "#512F0F", metallic: true, rgb: ["0.082", "0.028", "0.005", 1], ref: "Mahogany Brown ", category: 9, hsl: [0.051, 0.89, 0.044], }, { name: "Mahogany Metallic", hex: "#3C0606", metallic: true, rgb: ["0.045", "0.002", "0.002", 1], ref: "MahoganyMetallic", category: 9, hsl: [0, 0.923, 0.024], }, { name: "Mocha Brown", hex: "#331E12", metallic: false, rgb: ["0.033", "0.013", "0.006", 1], ref: "MochaBlack", category: 9, hsl: [0.043, 0.691, 0.02], }, { name: "Nougat Brown Metallic", hex: "#BF9570", metallic: true, rgb: ["0.521", "0.301", "0.162", 1], ref: "NougatBrownMetallic", category: 9, hsl: [0.064, 0.526, 0.342], }, { name: "Nutmeg Brown Metallic", hex: "#61330B", metallic: true, rgb: ["0.120", "0.033", "0.003", 1], ref: "NutmegBrownMetallic", category: 9, hsl: [0.043, 0.946, 0.061], }, { name: "Red Brown Metallic\t", hex: "#A1523D", metallic: true, rgb: ["0.356", "0.084", "0.047", 1], ref: "RedBrownMetallic", category: 9, hsl: [0.02, 0.768, 0.202], }, { name: "Rosewood Metallic (Palisander)", hex: "#694E4E", metallic: true, rgb: ["0.141", "0.076", "0.076", 1], ref: "RosewoodMetallic", category: 9, hsl: [0, 0.299, 0.109], }, { name: "Sable Brown Metallic", hex: "#534138", metallic: true, rgb: ["0.087", "0.053", "0.040", 1], ref: "SableBrown", category: 9, hsl: [0.047, 0.373, 0.063], }, { name: "Sepia Brown", hex: "#905508", metallic: false, rgb: ["0.279", "0.091", "0.002", 1], ref: "SepiaBrown", category: 9, hsl: [0.053, 0.983, 0.141], }, { name: "Terra Cotta", hex: "#DFA687", metallic: false, rgb: ["0.738", "0.381", "0.242", 1], ref: "TerraCotta", category: 9, hsl: [0.047, 0.506, 0.49], }, { name: "Tobacco Metallic", hex: "#816F43", metallic: true, rgb: ["0.220", "0.159", "0.056", 1], ref: "TobaccoMetallic", category: 9, hsl: [0.105, 0.593, 0.138], }, { name: "Togo Brown", hex: "#3C1F0C", metallic: false, rgb: ["0.045", "0.014", "0.004", 1], ref: "TogoBrown", category: 9, hsl: [0.04, 0.85, 0.024], }, { name: "Topaz Brown Metallic", hex: "#E6DCC4", metallic: true, rgb: ["0.791", "0.716", "0.552", 1], ref: "TopazBrown Metallic", category: 9, hsl: [0.114, 0.364, 0.672], }],
        carModels: [//replace this with api in future, or even json file
            { id: 'C0', name: 'Porsche 911 S/T', path: './visualizer/cdn/st.glb', brand: 'Porsche', header: '2024' },
            // { id: 'C1', name: 'Porsche 911 GT3 RS', path: './visualizer/cdn/gt3rs.glb', brand: 'Porsche', header: '2024' },
            { id: 'C2', name: 'Dodge Ram 1500', path: './visualizer/cdn/2021_ram_1500.glb?v=4', brand: 'Dodge', header: '2021'},
            { id: 'C3', name: 'Chevrolet Corvette', path: './visualizer/cdn/corvette.glb?v=10', brand: 'Chevrolet', header: '2023'},
            { id: 'C4', name: 'Ford Mustang', path: './visualizer/cdn/mustang.glb', brand: 'Ford', header: '2023'},
            { id: 'C5', name: 'Chevrolet Silverado Trail Boss', path: './visualizer/cdn/trailboss.glb?v=4', brand: 'Chevrolet', header: '2019'},
            { id: 'C6', name: 'Ford F150 Raptor', path: './visualizer/cdn/fordf150.glb?v=4', brand: 'Ford', header: '2022'},
            { id: 'C7', name: 'Porsche Cayenne', path: './visualizer/cdn/cayenne.glb?v=5', brand: 'Porsche', header: '2023'},
            { id: 'C8', name: 'Tesla Modal 3', path: './visualizer/cdn/tesla.glb?v=5', brand: 'Tesla', header: '2023'},
            { id: 'C9', name: 'Toyota 4 Runner', path: './visualizer/cdn/4runner.glb?v=4', brand: 'Toyota', header: '2024'},
            { id: 'C10', name: 'Ford Bronco', path: './visualizer/cdn/bronco.glb?v=5', brand: 'Ford', header: '2022'},
            { id: 'C11', name: 'BMW X5', path: './visualizer/cdn/bmw.glb?v=5', brand: 'BMW', header: '2020'},
        ],
        lightModels: [//replace this with api in future, or even json file
            { id: 'L0', name: 'Studio', path: './visualizer/cdn/skylit_garage_1k.hdr', skybox: './visualizer/cdn/skylit_garage_1k_floor_l.hdr', imgPath: './visualizer/cdn/garage_thumbnail.jpg' },
            { id: 'L1', name: 'Day', path: './visualizer/cdn/victoria_sunset_2k.hdr', skybox: './visualizer/cdn/victoria_sunset_2k.hdr', imgPath: './visualizer/cdn/day_thumbnail.jpg' },
            { id: 'L2', name: 'Night', path: './visualizer/cdn/solitude_night_1k.hdr', skybox: './visualizer/cdn/solitude_night_1k.hdr', imgPath: './visualizer/cdn/night_thumbnail.jpg' },
            { id: 'L3', name: 'Night', path: './visualizer/cdn/zwartkops_straight_sunset_1k.hdr', skybox: './visualizer/cdn/zwartkops_straight_sunset_1k.hdr', imgPath: './visualizer/cdn/test_thumbnail.jpg' },
            { id: 'L4', name: 'Night', path: './visualizer/cdn/rooftop_night_1k.hdr', skybox: './visualizer/cdn/rooftop_night_1k.hdr', imgPath: './visualizer/cdn/test_thumbnail.jpg' },
        ],
        selectedCarModelId: 'C0',
        selectedPaintId: 'BahiaRed',
        selectedLightId: 'L0',
        selectedColor: 0,
        usingCustomColor: false,
        colorPickerDebounceTimer: null,
        paintSwatchMode: 0,
        //--------------------------- Init / Main Entry Point ---------------------------//
        async init({ installerId = 'mvp', targetId, darkMode = false, loadCSS = true, log = false, height = 600, width = undefined, theme = { brandColor: 'green', loaderColor: 'green' }, helpers = false }) {
                        
            this.logEnabled = log;
            this.showHelpers = helpers;
            this.cLog(`Init: Target DOM Element: ${targetId}, Logs Enabled: ${log}`);

            // Ensure target element exists
            this.container = document.getElementById(targetId);
            if (!this.container) {
                this.cLog('Error: Target element doesn\'t exist, aborting');
                return;
            }

            if (loadCSS) {
                this.loadFonts();
                this.addGlobalStyles(height, width, theme);
            }

            await this.loadModelViewer();

            this.createVisualizer(theme, darkMode);

            // Add resize listener to update renderer and camera
            window.addEventListener('resize', this.onWindowResize.bind(this));
        },
        //--------------------------- Load ThreeJS ---------------------------//
        loadModelViewer() {
            return new Promise((resolve) => {
                const script = document.createElement("script");
                script.type = 'module';
                script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js';
                document.head.appendChild(script);
                setTimeout(resolve, 100);
            });
        },
        loadFonts() {
            const preconnect1 = document.createElement('link');
            preconnect1.rel = 'preconnect';
            preconnect1.href = 'https://fonts.googleapis.com';
            document.head.appendChild(preconnect1);

            const preconnect2 = document.createElement('link');
            preconnect2.rel = 'preconnect';
            preconnect2.href = 'https://fonts.gstatic.com';
            preconnect2.crossOrigin = 'anonymous';
            document.head.appendChild(preconnect2);

            const fontLink = document.createElement('link');
            fontLink.href = 'https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap';
            fontLink.rel = 'stylesheet';
            document.head.appendChild(fontLink);

            const imagePreload = document.createElement('link');
            imagePreload.href = './visualizer/cdn/skylit_garage_1k_floor_l.hdr';
            imagePreload.rel = 'preload';
            imagePreload.as = 'image';
            document.head.appendChild(imagePreload);

            const imagePreload2 = document.createElement('link');
            imagePreload2.href = './visualizer/cdn/solitude_night_1k.hdr';
            imagePreload2.rel = 'preload';
            imagePreload2.as = 'image';
            document.head.appendChild(imagePreload2);
        },
        //--------------------------- Create Visualizer ---------------------------//
        async createVisualizer(theme, darkMode) {
            this.cLog('Creating Visualizer');

            // Clear host container and create a wrapper
            this.container.innerHTML = '';

            //Create new wrapper
            const wrapper = document.createElement('div');
            wrapper.className = (darkMode) ? 'visualizer_wrapper dark' : 'visualizer_wrapper';
            this.container.appendChild(wrapper);
        
            //Create new wrapper
            const modelViewer = document.createElement('model-viewer');
            modelViewer.className = 'threeJSContainer';
            modelViewer.setAttribute('src',`./visualizer/cdn/st.glb?v=${this.cacheBuster}`);
            modelViewer.setAttribute('environment-image','./visualizer/cdn/skylit_garage_1k.hdr');
            modelViewer.setAttribute('camera-controls','');
            modelViewer.setAttribute('shadow-intensity','4');
            modelViewer.setAttribute('camera-orbit','30deg 80deg 7m');
            modelViewer.setAttribute('field-of-view','auto');
            modelViewer.setAttribute('resize-observer','');
            modelViewer.setAttribute('bounds','tight');
            // modelViewer.setAttribute('disable-zoom','');
            modelViewer.setAttribute('exposure','1');
            modelViewer.setAttribute('min-camera-orbit','auto 0deg auto');
            modelViewer.setAttribute('max-camera-orbit','auto 90deg auto');
            modelViewer.setAttribute('oncontextmenu','return false;');
            modelViewer.setAttribute('skybox-image','./visualizer/cdn/skylit_garage_1k_floor_l.hdr');
            modelViewer.setAttribute('skybox-height','3.5m');

            // modelViewer.setAttribute('auto-rotate','');
            modelViewer.setAttribute('ar-status','not-presenting');
            wrapper.appendChild(modelViewer);

            //Loading UI
            const loader = document.createElement('PROGRESS');
            loader.id = 'loader';
            modelViewer.appendChild(loader);

            //Hide MV Progress - this hides the native progress bar in mv
            const mvpb = document.createElement('DIV');
            mvpb.setAttribute('slot','progress-bar');
            modelViewer.appendChild(mvpb);

            modelViewer.addEventListener('load', e=> {
                this.currentModel = modelViewer.model;
                for (var i = 0; i < this.currentModel.materials.length; i++) {
                    const material = this.currentModel.materials[i];

                    if (material.name === 'Paint') {
                        const selectedPaint = this.getElementById(this.paintColors, this.selectedPaintId, 'ref');
                        material.pbrMetallicRoughness.setBaseColorFactor(selectedPaint.rgb);

                        const metallic = selectedPaint.metallic ? 1.0 : 0.0;
                        const roughness = selectedPaint.metallic ? 0.5 : 0.5;

                        material.pbrMetallicRoughness.setMetallicFactor(metallic);
                        material.pbrMetallicRoughness.setRoughnessFactor(roughness);
                        break;
                    }
                }

                const progressBar = document.getElementById('loader');
                progressBar.style.display = 'none';

            });
            modelViewer.addEventListener("progress", function (event) {
                console.log(event.detail);
                const progressBar = document.getElementById('loader');
                const progress = event.detail.totalProgress;
                progressBar.value = 100 * progress;
            });

            //
            this.animator = new ExposureAnimator(modelViewer);

  
            await this.createUI(wrapper, modelViewer);
            this.cLog('Ready!');
        },
        //--------------------------- UI Overlay/Chrome ---------------------------//
        async createUI(wrapper, threeJSContainer) {
            this.cLog('Adding UI Overlay');
            const THREE = this.THREE;

            const topBar = document.createElement('DIV');
            topBar.className = 'top_bar';
            wrapper.insertBefore(topBar, threeJSContainer);

            const dropdown = document.createElement('DIV');
            dropdown.className = 'dropdown';
            topBar.appendChild(dropdown);

            const dropbtn = document.createElement('BUTTON');
            dropbtn.className = 'dropbtn dark';
            dropdown.appendChild(dropbtn);

            const selectedModel = document.createElement('P');
            selectedModel.className = 'bold';
            selectedModel.innerHTML = 'Car Models';
            dropbtn.appendChild(selectedModel);

            const downArrow = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            downArrow.setAttribute('width', '10');
            downArrow.setAttribute('height', '6');
            downArrow.setAttribute('viewBox', '0 0 10 6');
            downArrow.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', 'M1 1l4 4 4-4');
            path.setAttribute('stroke', '#000000');
            path.setAttribute('fill', 'none');
            path.setAttribute('stroke-width', '2.5');

            downArrow.appendChild(path);
            dropbtn.appendChild(downArrow);

            const dropdownContent = document.createElement('DIV');
            dropdownContent.className = 'dropdown-content';
            dropdown.appendChild(dropdownContent);

            this.carModels.forEach((model) => {
                const dropdownItem = document.createElement('DIV');
                dropdownItem.className = (model.id == this.selectedCarModelId) ? 'dropdown-item primaryText selected' : 'dropdown-item primaryText';
                dropdownItem.innerHTML = model.name;
                dropdownItem.dataset.carId = model.id;
                dropdownItem.addEventListener('click', (event) => {
                    this.cLog('Model Changed', model);
                    // Clean up
                    this.currentModel = null;

                    const progressBar = document.getElementById('loader');
                    progressBar.value = 0;
                    progressBar.style.display = 'block';

                    const modelViewer = document.querySelector('model-viewer');
                    modelViewer.src = `${model.path}?v=${this.cacheBuster}`;

                    // //Local Data
                    this.selectedCarModelId = model.id;

                    //Update UI
                    const paintColorsHeader = document.getElementById('paintColorsHeader');
                    const carTypeHeader = document.getElementById('carTypeHeader');
                    if (paintColorsHeader && carTypeHeader) {
                        const selectedCarModel = this.getElementById(this.carModels, this.selectedCarModelId, 'ref');
                        paintColorsHeader.innerHTML = model.name;
                        carTypeHeader.innerHTML = model.header;
                    }
                    const items = document.querySelectorAll('[data-car-id]');
                    items.forEach(item => {
                        item.classList.remove('selected');

                        if (item.dataset.carId == this.selectedCarModelId) {
                            item.classList.add('selected');
                        }
                    });
                    // Trigger callback
                    this.triggerCallback('onCarModelChanged', model);
                    //Meta
                    this.userEvents.push(`Model Changed:${model.id}`)
                });

                dropdownContent.appendChild(dropdownItem);
            });

            const versionNumber = document.createElement('P');
            versionNumber.className = 'title6 lightText';
            versionNumber.innerHTML = `v${this.version}`;
            topBar.appendChild(versionNumber);

            const bottomBar = document.createElement('div');
            bottomBar.className = 'bottom_bar';
            wrapper.appendChild(bottomBar);

            const bottomBarTop = document.createElement('DIV');
            bottomBarTop.className = 'bottomBarTop mb24';
            bottomBar.appendChild(bottomBarTop);

            const modelHeader = document.createElement('DIV');
            bottomBarTop.appendChild(modelHeader);

            const selectedCarModel = this.getElementById(this.carModels, this.selectedCarModelId, 'id');

            const carTypeHeader = document.createElement('P');
            carTypeHeader.id = 'carTypeHeader';
            carTypeHeader.className = 'title5 mb4 ml8 lightText medium no_touch';
            carTypeHeader.innerHTML = selectedCarModel.header;
            modelHeader.appendChild(carTypeHeader);

            const paintColorsHeader = document.createElement('P');
            paintColorsHeader.id = 'paintColorsHeader';
            paintColorsHeader.className = 'title1 primaryText ml8 bold';
            paintColorsHeader.innerHTML = selectedCarModel.name;
            modelHeader.appendChild(paintColorsHeader);

            const bottomBarBottom = document.createElement('DIV');
            bottomBarBottom.className = 'bottomBarBottom';
            bottomBar.appendChild(bottomBarBottom);

            const paintModule = document.createElement('DIV');
            paintModule.className = 'module wide';
            bottomBarBottom.appendChild(paintModule);

            // var bottomGradient = document.createElement('DIV');
            // bottomGradient.className = 'bottomGradient';
            // paintModule.appendChild(bottomGradient);

            const paintHeader = document.createElement('DIV');
            paintHeader.className = 'paintHeader mb24';
            paintModule.appendChild(paintHeader);

                header = document.createElement('p');
                header.className = 'title4 primaryText bold mr16';
                header.innerHTML = 'Paint';
                paintHeader.appendChild(header);

                    const colorSelectorContainer = document.createElement('DIV');
                    colorSelectorContainer.className = 'colorSelectorContainer mr16';
                    paintHeader.appendChild(colorSelectorContainer);

                    const colors = [
                        { id: 0, color: 'red' },
                        { id: 1, color: 'orange' },
                        { id: 2, color: 'yellow' },
                        { id: 3, color: 'green' },
                        { id: 4, color: 'blue' },
                        { id: 5, color: 'purple' },
                        { id: 9, color: 'brown' },
                        { id: 8, color: 'black' },
                        { id: 7, color: 'silver' },
                        { id: 6, color: 'white' }
                      ];

                        colors.forEach((c) => {
                            const color = document.createElement('DIV');
                            color.className = (this.selectedColor == c.id) ? 'color selected' : 'color';
                            color.dataset.colorId = c.id;
                            color.style.backgroundColor = c.color;
                            color.addEventListener('click', () => {
                                this.selectedColor = c.id;

                                //Update UI
                                this.createSwatches();

                                const swatches = document.querySelectorAll('[data-color-id]');
                                swatches.forEach(swatch => {
                                    if (swatch.dataset.colorId == this.selectedColor) {
                                        swatch.classList.add('selected');
                                    } else {
                                        swatch.classList.remove('selected');
                                    }
                                });
                                //Callback
                                this.triggerCallback('onColorChanged', c.color);
                                //Meta
                                this.userEvents.push(`Color Changed:${c.color}`)
                            });
                            colorSelectorContainer.appendChild(color);
                        });


    

            const segmentedControlWrapper = document.createElement('DIV');
            segmentedControlWrapper.className = 'segmentedControlWrapper mb16';
            paintModule.appendChild(segmentedControlWrapper);

            const segmentedControl = document.createElement('DIV');
            segmentedControl.className = 'segmentedControl mr8';
            segmentedControlWrapper.appendChild(segmentedControl);

                        var segment = document.createElement('DIV');
                        segment.className = 'segment selected';
                        segment.innerHTML = 'Standard';
                        segment.dataset.segmentId = 0;
                        segment.addEventListener('click', () => {
                            this.paintSwatchMode = 0;
                            this.createSwatches();
                            //Update UI
                            const segments = document.querySelectorAll('[data-segment-id]');
                            segments.forEach(segment => {
                                if (segment.dataset.segmentId == this.paintSwatchMode) {
                                    segment.classList.add('selected');
                            } else {
                                segment.classList.remove('selected');
                            }
                            });
                        });
                        segmentedControl.appendChild(segment);

                        segment = document.createElement('DIV');
                        segment.className = 'segment';
                        segment.innerHTML = 'Metallic';
                        segment.dataset.segmentId = 1;
                        segment.addEventListener('click', () => {
                            this.paintSwatchMode = 1;
                            this.createSwatches();
                            //Update UI
                            const segments = document.querySelectorAll('[data-segment-id]');
                            segments.forEach(segment => {
                                if (segment.dataset.segmentId == this.paintSwatchMode) {
                                    segment.classList.add('selected');
                            } else {
                                segment.classList.remove('selected');
                            }
                            });
                        });
                    segmentedControl.appendChild(segment);

                    const colorPickerContainer = document.createElement('DIV');
                    colorPickerContainer.className = 'colorPickerContainer';
                    segmentedControlWrapper.appendChild(colorPickerContainer);
    
                            const colorPickerLabel = document.createElement('IMG');
                            colorPickerLabel.className = 'mr8';
                            colorPickerLabel.src = './visualizer/cdn/eyedropper-svgrepo-com.svg';
                            colorPickerLabel.height = 20;
                            colorPickerContainer.appendChild(colorPickerLabel);
    
                            const colorPickerInput = document.createElement('INPUT');
                            colorPickerInput.setAttribute('type', 'color');
                            colorPickerInput.id = 'favcolor';
                            colorPickerInput.name = 'favcolor';
                            colorPickerInput.value = '#ff0000';
                            colorPickerInput.addEventListener('input', () => {
                                const value = document.getElementById('favcolor').value;
                                if (this.currentModel) {
                                    this.cLog('Paint Applied', value);
                                    //Config & Apply Paint
                                    this.usingCustomColor = true;
                      
                                    for (var i = 0; i < this.currentModel.materials.length; i++) {
                                        const material = this.currentModel.materials[i];
                    
                                        if (material.name === 'Paint') {
                                            material.pbrMetallicRoughness.setBaseColorFactor(value);
                                            break;
                                        }
                                    }
                                    
                                    //Update UI  
                                    const swatches = document.querySelectorAll('[data-paint-id]');
                                    swatches.forEach(swatch => {
                                        swatch.classList.remove('selected');
                                    });     
                                    
                                    const colorPickerContainer = document.querySelector('.colorPickerContainer input');
                                    colorPickerContainer.classList.add('selected');
                                    
                                    //Callback
                                    clearTimeout(this.colorPickerDebounceTimer); 
                                    this.colorPickerDebounceTimer = setTimeout(() => {
                                        this.triggerCallback('onPaintApplied', value);
                                    }, 1000);
                                    //Meta
                                    this.userEvents.push(`Paint Applied:${value}`)
                                }
                            });
                            colorPickerContainer.appendChild(colorPickerInput);


            // header = document.createElement('p');
            // header.className = 'title6 primaryText medium mb8';
            // header.innerHTML = 'Standard Colors';
            // paintModule.appendChild(header);

            var swatchContainer = document.createElement('div')
            swatchContainer.id = 'swatchContainer';
            swatchContainer.className = 'swatchContainer';
            paintModule.appendChild(swatchContainer);

            this.createSwatches();


            // header = document.createElement('p');
            // header.className = 'title6 primaryText medium mb8';
            // header.innerHTML = 'Metallic Colors';
            // paintModule.appendChild(header);

            // if(this.paintSwatchMode == 1) {
            // scrollContainer = document.createElement('DIV');
            // scrollContainer.className = 'scroll';
            // paintModule.appendChild(scrollContainer);

            // swatchContainer = document.createElement('div');
            // swatchContainer.id = 'metallicSwatches';
            // swatchContainer.className = 'swatchContainer';
            // scrollContainer.appendChild(swatchContainer);

            //     this.createSwatches('metallicSwatches', 1);
            // }

            const lightModule = document.createElement('DIV');
            lightModule.className = 'module';
            bottomBarBottom.appendChild(lightModule);

            header = document.createElement('p');
            header.className = 'title4 primaryText bold mb24';
            header.innerHTML = 'Scene';
            lightModule.appendChild(header);

            // header = document.createElement('p');
            // header.className = 'title6 primaryText mb4';
            // header.innerHTML = 'Environment';
            // lightModule.appendChild(header);

    
            swatchContainer = document.createElement('div')
            swatchContainer.className = 'swatchContainer noScroll mb8';
            lightModule.appendChild(swatchContainer);

            this.lightModels.forEach((light) => {

                const swatch = document.createElement('IMG');
                swatch.className = (light.id == this.selectedLightId) ? 'swatch large selected' : 'swatch large';
                swatch.src = light.imgPath;
                swatch.alt = light.name;
                swatch.title = light.name;
                swatch.dataset.lightId = light.id;
                swatch.addEventListener('click', () => {
                    //Apply Light Change
                    const modelViewer = document.querySelector('model-viewer');
                    modelViewer.environmentImage = light.path;
                    modelViewer.skyboxImage = light.skybox;

                    if(light.id == 'L2')
                    {
                        this.animator.setExposure(0.5, 1000);

                    } 
                    else 
                    {
                        this.animator.setExposure(1.0, 1000);
                    }
                    this.selectedLightId = light.id;
                    //Update UI
                    const swatches = document.querySelectorAll('[data-light-id]');
                    swatches.forEach(swatch => {
                        if (swatch.dataset.lightId == this.selectedLightId) {
                            swatch.classList.add('selected');
                        } else {
                            swatch.classList.remove('selected');
                        }

                    });
                    //Callback
                    this.triggerCallback('onLightChanged', light);
                    //Meta
                    this.userEvents.push(`Light Changed:${light.id == 'L0' ? 'on' : 'off' }`)
                });
                swatchContainer.appendChild(swatch);
            });
        },
        createSwatches() {

            var container = document.getElementById("swatchContainer");
            container.innerHTML = '';

            const showingMetallic = (this.paintSwatchMode == 0) ? false : true;

            this.paintColors.filter(color => (color.metallic == showingMetallic) && color.category == this.selectedColor).forEach((color, index) => {
                const swatch = document.createElement('div');
                swatch.className = (color.ref == this.selectedPaintId) ? 'swatch selected' : 'swatch';
                swatch.style.background = showingMetallic ? `linear-gradient(135deg, rgba(0, 0, 0, 0.2), rgba(255, 255, 255, 0.3) 30%, rgba(0, 0, 0, 0.15) 60%, rgba(255, 255, 255, 0.2)), ${color.hex}` : color.hex;
                swatch.alt = color.name;
                swatch.dataset.paintId = color.ref;
                swatch.title = color.name;
                swatch.addEventListener('click', () => {
                    if (this.currentModel) {
                        this.cLog('Paint Applied', color);
                        //Config & Apply Paint
                        for (var i = 0; i < this.currentModel.materials.length; i++) {
                            const material = this.currentModel.materials[i];
        
                            if (material.name === 'Paint') {
                                material.pbrMetallicRoughness.setBaseColorFactor(color.rgb);
        
                                const metallic = color.metallic ? 1.0 : 0.0;
                                const roughness = color.metallic ? 0.5 : 0.5;
        
                                material.pbrMetallicRoughness.setMetallicFactor(metallic);
                                material.pbrMetallicRoughness.setRoughnessFactor(roughness);
        
                                break;
                            }
                            }
                        this.selectedPaintId = color.ref;
                        this.usingCustomColor = false;
                        
                        //Update UI
                        const swatches = document.querySelectorAll('[data-paint-id]');
                        swatches.forEach(swatch => {
                            if (swatch.dataset.paintId == this.selectedPaintId) {
                                swatch.classList.add('selected');
                            } else {
                                swatch.classList.remove('selected');
                            }
                        });

                        const colorPickerContainer = document.querySelector('.colorPickerContainer input');
                        colorPickerContainer.classList.remove('selected');

                        //Callback
                        this.triggerCallback('onPaintApplied', color);
                        //Meta
                        this.userEvents.push(`Paint Applied:${color.ref}`)
                    }
                });

                container.appendChild(swatch);
            });
        },
        //--------------------------- Utility ---------------------------//
        getElementById(array, id, param) {
            return array.find(item => item[param] === id);
        },
        addGlobalStyles(height, width, theme) {
            this.cLog('Adding Visualizer CSS script to host page HEAD');
            if (document.getElementById('visualizer-styles')) return;

            const style = document.createElement('style');
            style.id = 'visualizer-styles';
            style.innerHTML = `
.visualizer_wrapper,
.visualizer_wrapper * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.visualizer_wrapper {
    width: 100%;
    max-width: ${width}px;
    position: relative;
    font-family: 'Montserrat', serif;
    background: #eee;
    font-size: 16px;
    letter-spacing: 0.5px;
    border: 1px solid #ccc;
}

.visualizer_wrapper .primaryText
{
color: #000;
}

.visualizer_wrapper.dark
{
background: #000;
}

.visualizer_wrapper.dark .primaryText
{
color: #fff;
}

.visualizer_wrapper .title1 { font-size: 1.5em;  }
.visualizer_wrapper .title2 { font-size: 1.25em; }
.visualizer_wrapper .title3 { font-size: 1.125em; }
.visualizer_wrapper .title4 { font-size: 1em; }
.visualizer_wrapper .title5 { font-size: .875em; }
.visualizer_wrapper .title6 { font-size: .75em; }
.visualizer_wrapper .mb2 { margin-bottom: 2px }
.visualizer_wrapper .mb4 { margin-bottom: 4px }
.visualizer_wrapper .ml4 { margin-left: 4px }
.visualizer_wrapper .mb8 { margin-bottom: 8px }
.visualizer_wrapper .ml8 { margin-left: 8px }
.visualizer_wrapper .mr8 { margin-right: 8px }
.visualizer_wrapper .mb16 { margin-bottom: 16px }
.visualizer_wrapper .mr16 { margin-right: 16px }
.visualizer_wrapper .mb24 { margin-bottom: 24px }
.visualizer_wrapper .mb32 { margin-bottom: 32px }
.visualizer_wrapper .mb40 { margin-bottom: 40px }
.visualizer_wrapper .pl24 { padding-left: 24px }
.visualizer_wrapper .pr24 { padding-right: 24px }
.visualizer_wrapper .lightText { color: #888; }
.visualizer_wrapper .primaryText { color: #000; }

.visualizer_wrapper .threeJSContainer{
    height: ${height}px;
    width: 100%;
}

.visualizer_wrapper .bold {
    font-weight: bold;
}

.visualizer_wrapper .medium {
    font-weight: 500;
}

.visualizer_wrapper #loader 
{
    position: absolute;
   top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
    accent-color: ${theme.brandColor};
}

.visualizer_wrapper .top_bar {
    display: flex;
    width: 100%;
    padding: 16px 40px;
    align-items: center;
    justify-content: space-between;
}

.visualizer_wrapper .side_bar {
    position: absolute;
    top: calc(50px + 16px);
    left: 16px;
}

.visualizer_wrapper .bottom_bar {
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 16px 40px;
}

.visualizer_wrapper .bottom_bar .module 
{
    width: 240px;
    background: #FFFFFF;
    border-radius: 18px;
    box-shadow: 0px 1px 4px #bbb;
    padding: 24px 24px 0px 24px;
        position: relative;
}

.visualizer_wrapper.dark .bottom_bar .module 
{
    background: #303030;
    box-shadow: none;
}

.visualizer_wrapper .bottom_bar .module.wide 
{
    width: 424px;
}

 .visualizer_wrapper .bottom_bar .bottomBarTop 
 {
    width: 100%;
    display: flex;
    justify-content: space-between;
  align-items: center;
}

.visualizer_wrapper .bottom_bar .bottomBarBottom 
{
    width: 100%;
    display: flex;
    column-gap: 24px;
}

.visualizer_wrapper .paintHeader 
{
    display: flex;
    align-items: center;
}

.visualizer_wrapper .colorPickerContainer
{
    cursor: pointer;
    display: flex;
    align-items: center;
}

.visualizer_wrapper .colorPickerContainer input
{
    height: 26px;
    border: 2px solid #ddd;
    cursor: pointer;
}

.visualizer_wrapper.dark .colorPickerContainer input
{
    border: 2px solid #000;
}

.visualizer_wrapper .colorPickerContainer input:hover
{
    border: 2px solid ${theme.brandColor};
}

.visualizer_wrapper .colorPickerContainer input.selected
{
    border: 2px solid ${theme.brandColor};
}

.visualizer_wrapper .disclaimerBar
{
  width: 100%;
  bottom: 50px;
  display: flex;
  justify-content: center;
  font-size: 12px;
  align-items: center;
  height: 44px;
}

.visualizer_wrapper .scroll {
    overflow: scroll;
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
}

.visualizer_wrapper .swatchContainer
{
    display: flex;
    column-gap: 8px;
    row-gap: 4px;
    flex-wrap: wrap;
    overflow: scroll;
    height: 84px;
    padding-bottom: 16px;
}

.visualizer_wrapper .swatchContainer.noScroll
{
    overflow: inherit;
}

.visualizer_wrapper .colorSelectorContainer 
{
    display: flex;
    column-gap: 4px;
}

.visualizer_wrapper .module .bottomGradient
{
width: 100%;
height: 14px;
background: linear-gradient(0deg,rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0) 100%);
bottom: 0px;
left: 24px;
right: 24px;
position: absolute;
}

.visualizer_wrapper #paintColors {
    display: flex;
    column-gap: 8px;
}

.visualizer_wrapper .color {
    flex-shrink: 0;
    width: 22px;
    height: 22px;
    border-radius: 500px;
    display: block;
    background-color: white;
    border: 2px solid #ddd;
    cursor: pointer;
}

.visualizer_wrapper.dark .color 
{
    border: 2px solid #000;
}

.visualizer_wrapper .color:hover {
    border: 2px solid ${theme.brandColor};
}

.visualizer_wrapper .color.selected {
    border: 2px solid ${theme.brandColor};
}

.visualizer_wrapper .swatch {
    flex-shrink: 0;
    width: 30px;
    height: 30px;
    border-radius: 500px;
    display: block;
    background-color: white;
    border: 2px solid #ddd;
    cursor: pointer;
}

.visualizer_wrapper .swatch.large
{
    width: 40px;
    height: 40px;
}

.visualizer_wrapper.dark .swatch
{
    border: 2px solid #000;
}

.visualizer_wrapper .swatch:hover {
    border: 2px solid ${theme.brandColor};
}

.visualizer_wrapper .swatch.selected {
    border: 2px solid ${theme.brandColor};
}

.visualizer_wrapper button {
    background: ${theme.brandColor};
    color: #fff;
    border: none;
    border-radius: 500px;
    cursor: pointer;    
    font-size: 0.875em;
    font-family: 'Montserrat', serif;
}

.visualizer_wrapper button.pill {
    padding: 12px 24px;
}

.visualizer_wrapper button:hover {
    filter: brightness(85%);
}

.visualizer_wrapper .change_light {
    height: 50px;
    width: 50px;
    border: 2px solid #fff;
    cursor: pointer;   
    box-shadow: 0px 1px 4px #aaa; 
}

.visualizer_wrapper .change_light:hover {
    border: 2px solid ${theme.brandColor};
}

.visualizer_wrapper .progress-bar {
    height: 4px;
    background-color: rgba(5, 114, 206, 0.2);
    width: 200px;
    overflow: hidden;
    position: absolute;
    display: none;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.visualizer_wrapper .progress-bar-value {
    width: 100%;
    height: 100%;
    background-color: ${theme.brandColor};
    animation: indeterminateAnimation 1s infinite linear;
    transform-origin: 0% 50%;
}

@keyframes indeterminateAnimation {
    0% {
    transform:  translateX(0) scaleX(0);
    }
    40% {
    transform:  translateX(0) scaleX(0.4);
    }
    100% {
    transform:  translateX(100%) scaleX(0.5);
    }
}

.visualizer_wrapper  .segmentedControlWrapper
{
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.visualizer_wrapper  .segmentedControlWrapper .segmentedControl
{
    border:1px solid black;
    display: flex;
    border-radius: 5px;
}

.visualizer_wrapper.dark .segmentedControlWrapper .segmentedControl
{
    border:1px solid #fff;
}

.visualizer_wrapper .segmentedControlWrapper .segmentedControl .segment
{
    padding: 4px 8px;
    font-size: 0.675em;
    cursor: pointer;
}

.visualizer_wrapper.dark .segmentedControlWrapper .segmentedControl .segment
{
    color: #fff;
}


.visualizer_wrapper .segmentedControlWrapper .segmentedControl .segment:first-child
{
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
}

.visualizer_wrapper .segmentedControlWrapper .segmentedControl .segment:last-child
{
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
}


.visualizer_wrapper .segmentedControlWrapper .segmentedControl .segment:hover
{
    background-color: #ccc;
}

.visualizer_wrapper.dark .segmentedControlWrapper .segmentedControl .segment:hover
{
    background-color: #ccc;
}

.visualizer_wrapper .segmentedControlWrapper .segmentedControl .segment.selected
{
    background-color: #000;
    color: #fff;
}

.visualizer_wrapper.dark .segmentedControlWrapper .segmentedControl .segment.selected
{
    background-color: #fff;
    color: #000;
}

.visualizer_wrapper .segmentedControlWrapper input 
{
 background: transparent;
}

.visualizer_wrapper .debugText {
    position: absolute;
    top: 0;
    right: 0;
}

.visualizer_wrapper .dropbtn {
    display: flex;
    align-items: center;
    border: none;
    cursor: pointer;
    min-width: 200px;
    font-weight: 500;
    font-size: 16px;
    height: 50px;
    justify-content: left;
    background: none;
    color: #000000;
}

.visualizer_wrapper.dark .dropbtn
{
    color: #fff;
}

.visualizer_wrapper.dark .dropbtn svg path
{
    stroke: #fff;
}

.visualizer_wrapper .dropbtn p {
    margin-right: 4px;
}

.visualizer_wrapper .dropdown {
    position: relative;
    display: inline-block;
    min-width: 200px;
}

.visualizer_wrapper .dropdown-content {
    display: none;
    position: absolute;
    background-color: #f9f9f9;
    min-width: 200px;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    z-index: 1;
    max-height: 300px;
    overflow: scroll;
}

.visualizer_wrapper.dark .dropdown-content {
background: #303030;
}

.visualizer_wrapper .dropdown-content .dropdown-item {
    padding: 12px 16px;
    user-select: none;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
}

.visualizer_wrapper .dropdown-content .dropdown-item.selected {
    color: ${theme.brandColor};
}

.visualizer_wrapper .dropdown-content .dropdown-item:hover {
    background-color: #ccc
}

.visualizer_wrapper.dark .dropdown-content .dropdown-item:hover {
    background-color: #202020;
}

.visualizer_wrapper .dropdown:hover .dropdown-content {
    display: block;
}

.visualizer_wrapper  .dropdown:hover .dropbtn {
    background-color: #${theme.buttonHover};
}

@media only screen and (max-width: 600px) {

.visualizer_wrapper .threeJSContainer{
    height: 300px;
    width: 100%;
}

.visualizer_wrapper .top_bar {
    padding: 16px 16px;
    }

    .visualizer_wrapper .bottom_bar {
        padding: 16px 16px;
        }
    
.visualizer_wrapper .bottom_bar .bottomBarBottom {
            flex-direction: column;
            row-gap: 24px;
}

.visualizer_wrapper .bottom_bar .module 
{
    width: 100%;
}

.visualizer_wrapper .bottom_bar .module.wide 
{
    width: 100%;
}

.visualizer_wrapper .paintHeader {
flex-wrap: wrap;
row-gap: 12px;
}

.visualizer_wrapper .dropbtn {
            height: inherit;
}

.visualizer_wrapper button {
    padding: 0px 8px;
}

.visualizer_wrapper button. {
    padding: 6px 12px;
}
    
}
        `;
            document.head.appendChild(style);
        },

        onWindowResize() {
            this.cLog('Window Resize');

            const modelViewer = document.querySelector('model-viewer');
            modelViewer.jumpCameraToGoal();

            // const wrapper = this.container.querySelector('.threeJSContainer');
            // if (wrapper && this.camera && this.renderer) {
            //     const width = wrapper.clientWidth;
            //     const height = wrapper.clientHeight;
            //     this.camera.aspect = width / height;
            //     this.camera.updateProjectionMatrix();
            //     this.renderer.setSize(width, height);
            //     this.renderer.render(this.scene, this.camera)
            // }
        },
        removeModelFromScene(model, scene) {
            this.cLog('Removing Model From Scene');
            if (!model || !scene) return;

            model.traverse((child) => {
                if (child.isMesh) {
                    if (child.geometry) child.geometry.dispose();
                    if (child.material) {
                        if (Array.isArray(child.material)) {
                            child.material.forEach((material) => material.dispose());
                        } else {
                            child.material.dispose();
                        }
                    }
                }
            });

            scene.remove(model);
            model = null;
        },
        on(event, callback) {
            if (typeof callback === 'function') {
                this.callbacks[event] = callback;
            }
        },
        triggerCallback(event, data) {
            if (typeof this.callbacks[event] === 'function') {
                this.callbacks[event](data);
            } else {
                this.pendingEvents[event] = data;
            }
        },
        cLog(...args) {
            if (this.logEnabled) {
                console.log(`Visualizer SDK (${this.version}):`, ...args);
                this.triggerCallback('onDebug', ...args);
            }
        },
        //Public Function
        toggleColorMode:function(mode) 
        {
            const visualizer_wrapper = document.querySelector('.visualizer_wrapper');
            if(visualizer_wrapper) {
                if(mode == 0)
                {
                    visualizer_wrapper.classList.remove('dark');
                } 
                else 
                {
                    visualizer_wrapper.classList.add('dark');
                }
            }
        }
    };

    global.visualizer = visualizer;
})(window || globalThis);



/*
grave yard

     //--------------------------- Environment Models ---------------------------//
        async createEnvironmentModel() {
            this.cLog('Adding Environment Models');

            const { VertexNormalsHelper } = await import('three/addons/helpers/VertexNormalsHelper.js');
            const THREE = this.THREE;

            const textureLoader = new THREE.TextureLoader(this.loadingManager);
            const alphaMap = textureLoader.load('./visualizer/cdn/mask_image.png');

            // Add ground plane
            const planeGeometry = new THREE.PlaneGeometry(20, 20);
            const planeMaterial = new THREE.MeshStandardMaterial({
                color: 0xeeeeee,
                transparent: true,
                metalness: 0.0,
                roughness: 1.0,
                alphaMap: alphaMap,
                // envMap: this.scene.environment || null,
                // side: THREE.DoubleSide,
                // depthWrite: false
            });

            const plane = new THREE.Mesh(planeGeometry, planeMaterial);
            plane.rotation.x = -Math.PI / 2;
            plane.receiveShadow = true;
            plane.castShadow = false;
            //this.scene.add(plane);

            if (this.showHelpers) {
                const helper = new VertexNormalsHelper(plane, 1, 0xff0000);
                this.scene.add(helper);
            }
        },

                 this.directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
            this.directionalLight.position.set(2, 8, 0);
            this.directionalLight.castShadow = true;
            this.directionalLight.shadow.mapSize.width = 512;
            this.directionalLight.shadow.mapSize.height = 512;
            this.directionalLight.shadow.camera.near = 0.5;
            this.directionalLight.shadow.camera.far = 25;
            this.directionalLight.shadow.camera.left = -10;
            this.directionalLight.shadow.camera.right = 10;
            this.directionalLight.shadow.camera.top = 10;
            this.directionalLight.shadow.camera.bottom = -10;
            this.directionalLight.shadow.radius = 25;
            this.directionalLight.shadow.blurSamples = 25;
            this.directionalLight.shadow.intensity = 1.8;
            this.scene.add(this.directionalLight);

            if (this.showHelpers) {
                const lightHelper = new THREE.DirectionalLightHelper(this.directionalLight, 1, 0xff0000);
                this.scene.add(lightHelper);

                const shadowHelper = new THREE.CameraHelper(this.directionalLight.shadow.camera);
                this.scene.add(shadowHelper);
            }

*/