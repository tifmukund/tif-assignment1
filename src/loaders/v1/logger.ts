import winston from "winston";
class Logger{
    static instance: winston.Logger | Console

    static Loader = ():void =>{
        const loggerFormat = winston.format.combine(
            winston.format.cli(),
            winston.format.splat(),
            winston.format.errors({stack:true})
        )

        //Using Console, not Cloud
        let transports: winston.transport[] = [new winston.transports.Console()]

        //Stores all logs in Logger.instance
        Logger.instance = winston.createLogger({
            level:"debug",
            format: loggerFormat,
            transports,
        })
    }
}

export default Logger;