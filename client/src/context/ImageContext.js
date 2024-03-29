import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useRef,
} from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

export const ImageContext = createContext();

export const ImageProvider = (prop) => {
  const [images, setImages] = useState([]);

  const [myImages, setMyImages] = useState([]);

  const [isPublic, setIsPublic] = useState(true);

  const [imageUrl, setImageUrl] = useState("/images");

  const [imageLoading, setImageLoading] = useState(false);

  const [imageError, setImageError] = useState(false);

  const [me] = useContext(AuthContext);

  const pastImageUrlRef = useRef();

  useEffect(() => {
    if (pastImageUrlRef.current === imageUrl) return;
    setImageLoading(true);
    axios
      .get(imageUrl)
      .then((result) =>
        isPublic
          ? setImages((prevData) => [...prevData, ...result.data])
          : setMyImages((prevData) => [...prevData, ...result.data])
      )
      .catch((err) => {
        console.log(err);
        setImageError(err);
      })
      .finally(() => {
        setImageLoading(false);
        pastImageUrlRef.current = imageUrl;
      });
  }, [imageUrl, isPublic]); // get public data

  useEffect(() => {
    if (me) {
      setTimeout(() => {
        axios
          .get("/users/me/images")
          .then((result) => setMyImages(result.data))
          .catch((err) => console.log(err));
      }, 0); // "To make it happen next time for the event look, Set Time Out!"
    } else {
      setMyImages([]);
      setIsPublic(true);
    }
  }, [me]);

  return (
    <ImageContext.Provider
      value={{
        images: isPublic ? images : myImages,
        setImages,
        setMyImages,
        isPublic,
        setIsPublic,
        setImageUrl,
        imageLoading,
        imageError,
      }}
    >
      {prop.children}
    </ImageContext.Provider>
  );
};
