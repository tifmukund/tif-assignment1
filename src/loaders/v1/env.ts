import Logger from "./logger";

class Env{
    static names=[
        "PORT",
        "JWT_SECRET1",
        "DATABASE_URL"
    ] as const;

    static variables: Record<typeof Env.names[number], string | null> 

    static Loader(){
        const values: Record<string, string> = {}

        // Logger.instance.info('Env loader loaded')

        for (const key of Env.names) {
            const value = process.env[key];
      
            if (value) {
              values[key] = value;
            } else {
                console.error(`Enviroment variable key ${key} is Not Defined`);
                //Doesn't start server
                process.exit(1);
              
            }
          }
        Env.variables = values;
        
    }
}

export default Env;