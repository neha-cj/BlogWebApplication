import express from "express";
import bodyParser from "body-parser";
import methodOverride from "method-override";

const app =express();
const port = process.env.PORT || 3000;
app.set("view engine", "ejs");

app.use(express.static("public"));
let blogs=[];

app.use(methodOverride("_method"));

app.use(bodyParser.urlencoded({extended: true}));
app.use((req, res, next) => {
    res.locals.blogs = blogs; 
    next();
});
app.get("/",(req,res)=>{
    res.render("index.ejs");
});

app.get("/createBlog",(req,res)=>{
    res.render("createBlog.ejs");
});

app.post("/",(req,res)=>{
    const{title, content} =req.body;
    const id = blogs.length + 1;
    blogs.push({id, title, content});
    res.redirect("/");
});

app.get("/blogs/:id/edit", (req, res) => {
    const blogId = parseInt(req.params.id); // Get blog ID from URL
    const { title, content } = req.body; // Get updated values from form

    // Find the blog in the array
    const blog= blogs.find(b => b.id === blogId);
    
    if (!blog) {
        return res.status(404).send("Blog not found");
    }
    res.render("edit.ejs",{blog});
});
app.post("/blogs/:id/update", (req, res) => {
    const blogId = parseInt(req.params.id);
    const { title, content } = req.body;

    const blogIndex = blogs.findIndex(b => b.id === blogId);
    if (blogIndex === -1) return res.status(404).send("Blog not found");

    blogs[blogIndex] = { id: blogId, title, content }; // Update the blog
    res.redirect("/");
});

app.delete("/blogs/:id", (req, res) => {
    const blogId = parseInt(req.params.id);
    blogs = blogs.filter(blog => blog.id !== blogId);
    res.redirect("/");
});

app.listen(port, ()=>{
    console.log(`listening on port ${port}`);
});
