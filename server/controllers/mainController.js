// get home page
export const homepage = async (req, res) => {
    const locals = {
        title: "NodeJS Notes",
        description: "Free NodeJS Notes App."
    };

    res.render('index', {
        locals,
        layout: '../views/layouts/front-page'
    });
};

// get about 
export const about = async (req, res) => {
    const locals = {
        title: "About - NoteJS Notes",
        description: "Free NodeJS Notes App."
    }

    res.render('about', locals)
}
