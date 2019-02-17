class App{
    constructor(_context){
        this.ctx = _context;
        this.factor = 0;
    }

    getFactor(){
        this.factor = parseInt(document.querySelector("#factor").value);
    }

    brightness(iData){
        this.getFactor();
        for(let i=0;i<iData.data.length;i+=4){
            if(this.factor >= 0){
                iData.data[i]   = Math.min(255,iData.data[i]+this.factor);
                iData.data[i+1] = Math.min(255,iData.data[i+1]+this.factor);
                iData.data[i+2] = Math.min(255,iData.data[i+2]+this.factor);
            }
            else{
                iData.data[i]   = Math.max(0,iData.data[i]+this.factor);
                iData.data[i+1] = Math.max(0,iData.data[i+1]+this.factor);
                iData.data[i+2] = Math.max(0,iData.data[i+2]+this.factor);
            }
        }
        return iData;
    }

    contrast(iData){
        this.getFactor();
        for(let i=0;i<iData.data.length;i+=4){
            let avg = (iData.data[i]+iData.data[i+1]+iData.data[i+2])/3

            if(avg>=127){
                iData.data[i]   = Math.min(255,iData.data[i]+this.factor);
                iData.data[i+1] = Math.min(255,iData.data[i+1]+this.factor);
                iData.data[i+2] = Math.min(255,iData.data[i+2]+this.factor);
            }
            else{
                iData.data[i]   = Math.max(0,iData.data[i]-this.factor);
                iData.data[i+1] = Math.max(0,iData.data[i+1]-this.factor);
                iData.data[i+2] = Math.max(0,iData.data[i+2]-this.factor);
            }
        }
        return iData;
    }

    saturation(iData){
        this.getFactor();
        //https://stackoverflow.com/questions/13806483/increase-or-decrease-color-saturation
        for(let i=0;i<iData.data.length;i+=4){
            
            var gray = 0.2989*iData.data[i] + 0.5870*iData.data[i+1] + 0.1140*iData.data[i+2]; //weights from CCIR 601 spec
            iData.data[i] = -gray * this.factor + iData.data[i] * (1+this.factor);
            iData.data[i+1] = -gray * this.factor + iData.data[i+1] * (1+this.factor);
            iData.data[i+2] = -gray * this.factor + iData.data[i+2] * (1+this.factor);

            //normalize over- and under-saturated values
            if(iData.data[i] > 255) iData.data[i] = 255;
            if(iData.data[i+1] > 255) iData.data[i] = 255;
            if(iData.data[i+2] > 255) iData.data[i] = 255;
            if(iData.data[i] < 0) iData.data[i] = 0;
            if(iData.data[i+1] < 0) iData.data[i] = 0;
            if(iData.data[i+2] < 0) iData.data[i] = 0;

        }
        return iData;
    }

    blackAndWhite(iData){
        for(let i=0;i<iData.data.length;i+=4){
            let avg = parseInt((iData.data[i]+iData.data[i+1]+iData.data[i+2])/3);

            iData.data[i+2] = iData.data[i+1] = iData.data[i] = avg;
        }
        return iData;
    }

    filterColor(color,iData){
        switch (color){
            case "red":
                for(let i=0;i<iData.data.length;i+=4){
                    iData.data[i+1] = 0;
                    iData.data[i+2] = 0;
                }
                break;
            case "green":
                for(let i=0;i<iData.data.length;i+=4){
                    iData.data[i]   = 0;
                    iData.data[i+2] = 0;
                }
                break;
            case "blue":
                for(let i=0;i<iData.data.length;i+=4){
                    iData.data[i]   = 0;
                    iData.data[i+1] = 0;
                }
                break;
        }
        return iData;
    }

    sepia(iData){
        //https://www.techrepublic.com/blog/how-do-i/how-do-i-convert-images-to-grayscale-and-sepia-tone-using-c/

        for(let i=0;i<iData.data.length;i+=4){
            iData.data[i]   = Math.min(255,(iData.data[i]*0.393)+(iData.data[i+1]*0.769)+(iData.data[i+2]*0.189));
            iData.data[i+1] = Math.min(255,(iData.data[i]*0.349)+(iData.data[i+1]*0.686)+(iData.data[i+2]*0.168));
            iData.data[i+2] = Math.min(255,(iData.data[i]*0.272)+(iData.data[i+1]*0.534)+(iData.data[i+2]*0.131));
        }
        return iData;
    }
}
