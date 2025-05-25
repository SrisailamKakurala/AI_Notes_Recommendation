import { NoteMetadata } from './noteGenerator.js';

export const getRoadmapPrompt = (content: string, type: string) => {

    const prompt = `
        You are an expert educational content creator. Your task is to create comprehensive, well-structured notes based on the syllabus or course content provided below.

        TYPE= ${type}:
        -------------------------------
        ${content}.
        -------------------------------

        the roadmap should be comprehensive from basic to advanced.
        
        Output Structure:

        {
            "roadmapjson": "...json code of roadmap"
        }

        Output format:
        {
            "roadmapjson": { // json format to generate further brief notes of sub-topics.
                "phase1": {
                "title": "Planning",
                "description": "Initial research and planning of the web application",
                "subPhases": {
                    "subPhase1": {
                    "title": "Define requirements",
                    "description": "Gather all necessary information to understand project goals."
                    },
                    "subPhase2": {
                    "title": "Research technologies",
                    "description": "Choose the right stack and tools for development."
                    }
                }
                },
                "phase2": {
                "title": "Development",
                "description": "Develop the web application using React and Node.js",
                "subPhases": {
                    "subPhase1": {
                    "title": "Set up React project",
                    "description": "Initialize a new React project with necessary configurations."
                    },
                    "subPhase2": {
                    "title": "Set up Node.js server",
                    "description": "Create a Node.js server to handle backend logic."
                    }
                }
                }
            }
        }


        NOTE: **make sure u only return json object and nothing before or after.**
        NOTE: **the Roadmap should be comprehensive and beginner to advanced.**
        NOTE: **Divide the Entire portion in to several phases!! strictly.**
        NOTE: **If TYPE=syllabus then each chapter/unit should be divided in to each phase and each phase should contain at least 10-15 subphases MINIMUM**
        NOTE: **If TYPE=chapter then each topic should be divided in to each phase and each phase can contain multiple subphases depending on complexity of chapter/topic [keep it short mostly, since it's just a chapter, don't need unncessary subphases overly nested subphases, only what is required]**
        NOTE: **If TYPE=topic then u can define the phases and sub phases depending on the complexity of topic, try to keep it short with examples since it's just a topic max of 2-3 phases and 1-2 nesting of subphases if reequired more by the topic then u can add else keep it way short**


        Now generate the roadmap for the above SYLLABUS.
        `;

    return prompt;
}

export const getNotesPrompt = (type: string) => {
    const prompt = `give a brief notes for the following concepts:

    ----------
    for ur info: [this is use below, don't include in notes]
    TYPE= ${type}:
    ----------

    explain as if i'm a beginner and explain every method.. and the notes should be comprehensive.

    Please generate detailed, comprehensive educational notes that:
    1. Cover all the topics mentioned in the original content
    2. Expand with detailed explanations, examples, and clarifications
    3. Use a clear, academic structure with headings and subheadings
    4. Include relevant definitions, concepts, and principles
    5. Are suitable for college-level students
    6. Are well-organized for easy studying and reference

    FORMAT:
    - Use Markdown for structure
    - Use # for main headings (H1)
    - Use ## for subheadings (H2)
    - Use ### for sub-subheadings (H3)
    - Use bullet points and numbered lists where appropriate
    - Bold key terms and important concepts

    Your response should only contain the formatted notes content, without any introductory or concluding remarks.

    NOTE:**if Type=syllabus then give a lengthy and comprehensive response with examples leaving none**
    NOTE:**if Type=chapter then medium length notes**
    NOTE:**if Type=topic then give a very short and conscise notes with examples all in around 20-30 lines**
    `;

    return prompt;
}