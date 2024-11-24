import mongoose from "mongoose";
import Note from "../models/Notes.js";

// get dashboard
export const dashboard = async (req, res) => {
    let perPage = 12;
    let page = req.query.page || 1;

    const locals = {
        title: "Dashboard",
        description: "Free NodeJS Notes App."
    }

    try {
        const notes = await Note.aggregate([
            {
                $sort: { UpdatedAt: -1 }
            },
            {
                $match: { user: new mongoose.Types.ObjectId(req.user.id) }
            },
            {
                $project: {
                    title: { $substr: ['$title', 0, 30] },
                    body: { $substr: ['$body', 0, 100] }
                }
            }
        ])
        .skip(perPage * page - perPage)
        .limit(perPage);

        const count = await Note.countDocuments();

        res.render('dashboard/index', {
            notes,
            userName: req.user.firstName,
            locals,
            layout: "../views/layouts/dashboard",
            current: page,
            pages: Math.ceil(count / perPage)
        });
    } catch (error) {
        console.log(error);
    }
}

// get
// view specific Note

export const dashboardViewNote = async (req, res) => {
    const note = await Note.findById({_id: req.params.id})
    .where({user: req.user._id}).lean();

    if(note) {
        res.render('dashboard/view-notes', {
            noteID: req.params.id,
            note,
            layout: '../views/layouts/dashboard'
        })
    } else {
        res.send("something went wrong")
    }
}

// PUT
// Update Specific Note

export const dashboardUpdateNote = async (req, res) => {
    try {
        await Note.findOneAndUpdate(
            {_id: req.params.id},
            {title: req.body.title, body: req.body.body, UpdatedAt: Date.now()},
        ).where({user: req.user._id});

        res.redirect("/dashboard");
    } catch (error) {
        console.log(error)
    }

}

// DELETE
// delete note
export const dashboardDeleteNote = async (req, res) => {
    try {
        await Note.deleteOne({_id: req.params.id})
        .where({user: req.user._id});
        res.redirect("/dashboard");
    } catch (error) {
        console.log(error);
    }
}

// Get
// ADD Note

export const dashboardAddNote = async (req, res) => {
    res.render('dashboard/add', {
        layout: '../views/layouts/dashboard'
    });
}

export const dashboardAddNoteSubmit = async (req, res) => {
    try {
        req.body.user = req.user._id
        await Note.create(req.body);
        res.redirect('/dashboard')
    } catch (error) {
        console.log(error)
    }
}


// GET
// Search Notes

export const dashboardSearch = async (req, res) => {
    try {
        res.render('dashboard/search', {
            searchResults: '',
            layout: '../views/layouts/dashboard'
        })
    } catch (error) {
        console.log(error);
    }
}

// Post
// Search notes

export const dashboardSearchSubmit = async (req, res) => {
    try {
        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChars = searchTerm.replace(/[^a-zA-Z0-9]/g, "");

        const searchResults = await Note.find({
            $or: [
                {
                    title: {$regex: new RegExp(searchNoSpecialChars, 'i')}
                },
                {
                    body: {$regex: new RegExp(searchNoSpecialChars, 'i')}
                },
            ]
        }).where({user: req.user._id});
        res.render('dashboard/search', {
            searchResults,
            layout: '../views/layouts/dashboard'
        })
    } catch (error) {
        console.log(error);
    }
}