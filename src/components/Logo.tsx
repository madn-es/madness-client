import { Text } from "ink";

// 여기서 아스키아트를 바꿔보세요
const LOGO = `
  ooo        ooooo                 .o8                                          
\`88.       .888'                "888                                          
 888b     d'888   .oooo.    .oooo888  ooo. .oo.    .ooooo.   .oooo.o  .oooo.o 
 8 Y88. .P  888  \`P  )88b  d88' \`888  \`888P"Y88b  d88' \`88b d88(  "8 d88(  "8 
 8  \`888'   888   .oP"888  888   888   888   888  888ooo888 \`"Y88b.  \`"Y88b.  
 8    Y     888  d8(  888  888   888   888   888  888    .o o.  )88b o.  )88b 
o8o        o888o \`Y888""8o \`Y8bod88P" o888o o888o \`Y8bod8P' 8""888P' 8""888P'
`.trimStart();

export default function Logo() {
  return (
    <Text color="cyan" bold>
      {LOGO}
    </Text>
  );
}
