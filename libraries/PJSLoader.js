var PJSCache = {
    PImageCache: {},
    imgCacheName: "pjs-image-cache",
    PSoundCache: {},
    sndCacheName: "pjs-sound-cache",
    urls: {
        proxy: "https://cors-anywhere.herokuapp.com/", 
        sound: "https://raw.githubusercontent.com/Khan/live-editor/master/sounds/",
        image: "https://www.kasandbox.org/third_party/javascript-khansrc/live-editor/build/images/"
    },
    template: function()
    {
        processing.size(400, 400);
        processing.background(255, 255, 255);
        processing.angleMode = "degrees";
        
        processing.mouseClicked = function() {};
        processing.mousePressed = function() {};
        processing.mouseReleased = function() {};
        processing.mouseMoved = function() {};
        processing.mouseDragged = function() {};
        processing.mouseOver = function() {};
        processing.mouseOut = function() {};
        processing.keyPressed = function() {};
        processing.keyReleased = function() {};
        processing.keyTyped = function() {};
        
        processing.playSound = function(source, volume) 
        {
            if(!source)
            {
                return;
            }

            var sound = new Audio();
            sound.volume = (typeof volume === "number" ? vol : 1);
            sound.appendChild(source);
            sound.play().catch(); 
        };
        processing.getSound = function(path) 
        {
            return PJSCache.PSoundCache[path.split(".")[0] + ".mp3"];
        };
        processing.getImage = function(name) 
        {
            return PJSCache.PImageCache[name.split(".")[0] + ".png"] || processing.get(0, 0, 1, 1);
        };

        processing.Program = {
            restart: function() 
            {
                window.location.reload();
            },
            assertEqual: function(equiv)
            {
                if(!equiv) 
                {
                    console.warn(equiv);
                }
            },
            runTest: function()
            {

            },
            runTests: function()
            {

            },
            settings: function()
            {
                
            }
        };

        processing.debug = function()
        {
            return console.log.apply(console.log, arguments);
        };
    }
};

var PJSLoader = {
    pjs: new Processing(),

    imagesLoadedNotif: function()
    {
        processing.draw = function()
        {
            processing.background(0, 0, 0);
            processing.textAlign(processing.CENTER, processing.CENTER);
            processing.fill(230, 230, 255);
            processing.text("Images loaded\n Please refresh", 200, 60);
        };
    },
    soundsLoadedNotif: function()
    {
        processing.draw = function()
        {
            processing.background(0, 0, 0);
            processing.textAlign(processing.CENTER, processing.CENTER);
            processing.fill(230, 230, 255);
            processing.text("Sounds loaded\n Please refresh", 200, 60);
        };
    },

    loadSketch: function(canvasId, sketch)
    {
        var args = Array.prototype.slice.call(arguments);
        args.shift();

        sketch = this.combineFuncs.apply(this.combineFuncs, args);

        var sketchStr = sketch.toString();

        this.getPathsToLoad(sketchStr);
        this.saveResources();
        this.loadResources(function()
        {
            var canvas = document.getElementById(canvasId);
            
            window.processing = new Processing(canvas, PJSLoader.parse(sketchStr));
        });
    },

    // Resource loader
    getPathsToLoad: function(sketchStr)
    {
        PJSCache.imagePaths = {};

        sketchStr.replace(/getImage([ ]*)\(([ ]*)\'(.*)\'([ ]*)\)/g, function(element, index)
        {
            PJSCache.imagePaths[element.replace(/getImage([ ]*)\(([ ]*)\'/, "").replace(/\'[ ]*\)/, "")] = true;

            return element;
        });

        sketchStr.replace(/getImage([ ]*)\(([ ]*)\"(.*)\"([ ]*)\)/g, function(element, index)
        {
            PJSCache.imagePaths[element.replace(/getImage([ ]*)\(([ ]*)\"/, "").replace(/\"[ ]*\)/, "")] = true;

            return element;
        });

        PJSCache.soundPaths = {};

        sketchStr.replace(/getSound([ ]*)\(([ ]*)\'(.*)\'([ ]*)\)/g, function(element, index)
        {
            PJSCache.soundPaths[element.replace(/getSound([ ]*)\(([ ]*)\'/, "").replace(/\'[ ]*\)/, "")] = true;

            return element;
        });

        sketchStr.replace(/getSound([ ]*)\(([ ]*)\"(.*)\"([ ]*)\)/g, function(element, index)
        {
            PJSCache.soundPaths[element.replace(/getSound([ ]*)\(([ ]*)\"/, "").replace(/\"[ ]*\)/, "")] = true;

            return element;
        });
    },

    saveImages: function()
    {
        var paths = Object.keys(PJSCache.imagePaths);

        var imageCache = localStorage.getItem(PJSCache.imgCacheName);
        if(imageCache)
        {
            imageCache = JSON.parse(imageCache);  
        }
        else
        {      
            localStorage.setItem(PJSCache.imgCacheName, "{}");
            imageCache = {};  
        }

        var toDataURL = this.toDataURL;
        var imagesLoadedNotif = this.imagesLoadedNotif;
        var foundTimes = 0;

        var save = function(path)
        {
            var normalizedPath = path.split(".")[0] + ".png";

            // If the image cache already has it, then skip the loading...
            if(imageCache[normalizedPath])
            {
                paths.shift();

                if(paths.length !== 0)
                {
                    return save(paths[0]);
                }

                localStorage.setItem(PJSCache.imgCacheName, JSON.stringify(imageCache));

                if(foundTimes > 0)
                {
                   imagesLoadedNotif();
                }

                return;
            }

            toDataURL(PJSCache.urls.proxy + PJSCache.urls.image + normalizedPath, function(dataUrl, notFound)
            {
                if(!notFound)
                {
                    foundTimes++;
                    imageCache[normalizedPath] = dataUrl;
                }

                paths.shift();

                if(paths.length !== 0)
                {
                    return save(paths[0]);
                }

                localStorage.setItem(PJSCache.imgCacheName, JSON.stringify(imageCache));

                if(foundTimes > 0)
                {
                    imagesLoadedNotif();
                }
            });
        };

        if(paths.length !== 0)
        {
            save(paths[0]);
        }
    },

    saveSounds: function()
    {
        var paths = Object.keys(PJSCache.soundPaths);

        var soundCache = localStorage.getItem(PJSCache.sndCacheName);
        if(soundCache)
        {
            soundCache = JSON.parse(soundCache);  
        }
        else
        {      
            localStorage.setItem(PJSCache.sndCacheName, "{}");
            soundCache = {};  
        }

        var toDataURL = this.toDataURL;
        var soundsLoadedNotif = this.soundsLoadedNotif;
        var foundTimes = 0;

        var save = function(path)
        {
            var normalizedPath = path.split(".")[0] + ".mp3";

            // If the sound cache already has it, then skip the loading...
            if(soundCache[normalizedPath])
            {
                paths.shift();

                if(paths.length !== 0)
                {
                    return save(paths[0]);
                }

                localStorage.setItem(PJSCache.sndCacheName, JSON.stringify(soundCache));

                if(foundTimes > 0)
                {
                    soundsLoadedNotif();
                }

                return;
            }

            toDataURL(PJSCache.urls.proxy + PJSCache.urls.sound + normalizedPath, function(dataUrl, notFound)
            {
                if(!notFound)
                {
                    foundTimes++;
                    soundCache[normalizedPath] = dataUrl;
                }

                paths.shift();

                if(paths.length !== 0)
                {
                    return save(paths[0]);
                }

                localStorage.setItem(PJSCache.sndCacheName, JSON.stringify(soundCache));

                if(foundTimes > 0)
                {
                    soundsLoadedNotif();
                }
            });
        };

        if(paths.length !== 0)
        {
            save(paths[0]);
        }
    },

    saveResources: function()
    {
        this.saveImages();
        this.saveSounds();
    },

    loadImages: function(callback)
    {
        var imageCache;
        var paths = Object.keys(imageCache = JSON.parse(localStorage.getItem(PJSCache.imgCacheName)));

        var PImage = this.pjs.PImage;

        var load = function(path)
        {   
            var img = document.createElement("img");

            img.src = imageCache[path];

            var pimg = new PImage();
            pimg.sourceImg = img;

            img.onload = function()
            {
                pimg.fromHTMLImageData(img);

                PJSCache.PImageCache[path] = pimg;

                paths.shift();

                if(paths.length !== 0)
                {
                    return load(paths[0]);
                }

                // It's done call the callback
                callback();
            };
        };

        if(paths.length === 0)
        {
            return callback();
        }

        load(paths[0]);
    },

    loadSound: function(callback)
    {
        var soundCache;
        var paths = Object.keys(soundCache = JSON.parse(localStorage.getItem(PJSCache.sndCacheName)));

        var load = function(path)
        {   
            var source = document.createElement("source");

            source.src = soundCache[path];

            PJSCache.PSoundCache[path] = source;

            paths.shift();

            if(paths.length !== 0)
            {
                return load(paths[0]);
            }

            // It's done call the callback
            callback();
        };

        if(paths.length === 0)
        {
            return callback();
        }

        load(paths[0]);
    },

    loadResources: function(callback)
    {
        var self = this;
        this.loadSound(function()
        {
            self.loadImages(callback);
        });
    },

    toDataURL: function(url, callback) 
    {
        var xhr = new XMLHttpRequest();
        xhr.onload = function() 
        {
            var reader = new FileReader();
            reader.onloadend = function() 
            {
                callback(reader.result, xhr.status == 404);
            };
            reader.readAsDataURL(xhr.response);
        };
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send();
    },

    // Parser
    parse: function(sketchStr)
    {
        sketchStr = this.combineFuncs(sketchStr.replace(/^function[ ]*any[ ]*\(\)/, "function(processing)"), 
        {
            beginCode: this.removeFuncOutline(PJSCache.template.toString()) + "with(processing)\n{",
            endCode: "}\n"
        });

        return sketchStr;
    },

    removeFuncOutline: function(func)
    {
        return func.replace(/^function\(\)/, "").replace(/{/, "").replace(/}$/, "");
    },

    combineFuncs: function(a, c)
    {
        var args = Array.prototype.slice.call(arguments);
        var config = {};

        var funcArgs = "";
        var join = "";
        for(var i = 0; i < args.length; i++)
        {
            if(typeof args[i] === "object")
            {
                config = args[i];
                continue;
            }

            var to = args[i].toString();

            var temp = to.substring(to.indexOf('(') + 1, to.indexOf(')'));

            if(temp !== "" && temp !== " ")
            {
                funcArgs += temp + ",";
            }

            join += to.slice(to.indexOf('{') + 1, -1);
        }

        funcArgs = funcArgs.slice(0, -1);
        
        return new Function("return function any(" + funcArgs + ")\n{" + (config.beginCode || "").replace("\n", "") + join + (config.endCode || "") + "}")();
    },
};