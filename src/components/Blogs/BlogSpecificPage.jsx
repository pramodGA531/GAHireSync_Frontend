import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TopNav from "../LandingPage/TopNav";
import RecentBlog from "./RecentBlog";
import { message } from "antd";
import { useAuth } from "../common/useAuth";
import he from "he";

const BlogSpecificPage = () => {
    const { id } = useParams();
    const { token, apiurl } = useAuth();
    const [blog, setBlog] = useState({});
    const [cleanContent, setCleanContent] = useState("");

    const fetchParticularBlog = async () => {
        try {
            const response = await fetch(`${apiurl}/myblogs/?blog_id=${id}`, {
                method: "GET",
            });
            const result = await response.json();
            if (result.error) {
                message.error(result.error);
            } else {
                setBlog(result);

                // Decode HTML entities
                const decodedContent = he.decode(result.content || "");
                const hasHTML = /<\/?[a-z][\s\S]*>/i.test(decodedContent);

                // Clean <pre> tags only if it's HTML
                const finalContent = hasHTML
                    ? decodedContent.replace(/<\/?pre[^>]*>/g, "")
                    : `<p>${decodedContent}</p>`;

                setCleanContent(finalContent);
            }
        } catch (e) {
            message.error("Failed to fetch blogs");
        }
    };

    useEffect(() => {
        fetchParticularBlog();
    }, []);

    // useEffect(() => {
    //   const container = document.querySelector(".blog-total-content");
    //   if (!container) return;

    //   const images = container.querySelectorAll("img");
    //   if (images.length === 0) return;

    //   const applySingleImageStyle = (img) => {
    //     img.style.display = "block";
    //     img.style.margin = "20px auto";
    //     img.style.width = "500px";
    //   };

    //   const clearExistingImages = () => {
    //     images.forEach((img) => {
    //       if (img.parentElement) img.parentElement.removeChild(img);
    //     });
    //   };

    //   if (images.length === 1) {
    //     const img = images[0];
    //     applySingleImageStyle(img);
    //     clearExistingImages();
    //     container.appendChild(img);
    //   }

    //   else if (images.length === 2) {
    //     const [img1, img2] = images;

    //     // Style both images
    //     applySingleImageStyle(img1);
    //     applySingleImageStyle(img2);

    //     clearExistingImages();

    //     // Insert img1 in the middle of the content
    //     const middleIndex = Math.floor(container.children.length / 2);
    //     container.insertBefore(img1, container.children[middleIndex]);

    //     // Insert img2 before the last element
    //     container.insertBefore(img2, container.lastElementChild);
    //   }

    //   else if (images.length >= 3) {
    //     const [img1, img2, img3] = images;

    //     img1.classList.add("img1");
    //     img2.classList.add("img2");
    //     img3.classList.add("img3");

    //     const wrapper = document.createElement("div");
    //     wrapper.className = "custom-image-wrapper";

    //     const rightDiv = document.createElement("div");
    //     rightDiv.className = "right-images";

    //     rightDiv.appendChild(img2);
    //     rightDiv.appendChild(img3);

    //     wrapper.appendChild(img1);
    //     wrapper.appendChild(rightDiv);

    //     clearExistingImages();

    //     container.appendChild(wrapper);
    //   }
    // }, [blog]);

    return (
        <>
            <TopNav color="blue"></TopNav>
            <RecentBlog
                author={blog.author}
                created_at={blog.created_at}
                tags={blog.tags}
                thumbnail={blog.thumbnail}
                title={blog.title}
            />

            <div
                className="w-[80%] mx-auto text-left text-[#333] mt-10 [&_p]:mb-4 [&_img]:max-w-full [&_img]:h-auto [&_pre]:whitespace-pre-wrap leading-relaxed"
                dangerouslySetInnerHTML={{ __html: cleanContent }}
            />
        </>
    );
};

export default BlogSpecificPage;
