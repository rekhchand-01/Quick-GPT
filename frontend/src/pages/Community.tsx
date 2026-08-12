import React, { useEffect } from "react";
import { useAuth } from "../clerk";
import { Loader2 } from "lucide-react";
import { usePublishedImages, useToggleLike, setCurrentUserIdForLike } from "../hooks/useCommunity";
import { CommunityCard } from "../components/community/CommunityCard";

const Community: React.FC = () => {
    const { userId } = useAuth();
    const currentUserId = userId as string;

    useEffect(() => {
        if (currentUserId) {
            setCurrentUserIdForLike(currentUserId);
        }
    }, [currentUserId]);

    const {
        data: images = [],
        isLoading,
        isError,
    } = usePublishedImages();

    const { mutate: toggleLike } = useToggleLike();

    const handleToggleLike = (imageId: string) => {
        toggleLike(imageId);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#fafafa] flex flex-col justify-center items-center gap-4">
                <Loader2 className="w-12 h-12 animate-spin text-purple-600" />
                <p className="text-gray-400 font-medium animate-pulse">Curating gallery...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
                <p className="text-red-600 font-medium">Failed to load community gallery</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fafafa]">
            {/* Hero Header */}
            <div className="bg-white border-b border-gray-100 py-8 px-2 sm:px-6 mb-8">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">
                        Community Art Gallery
                    </h1>
                    <p className="text-gray-500 text-base sm:text-lg max-w-xl mx-auto">
                        Discover the most liked and recently generated masterpieces from our community of creators.
                    </p>
                </div>
            </div>

            {/* Gallery Grid */}
            <div className="max-w-350 mx-auto px-2 sm:px-6">
                {images.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-400 text-lg">No published images yet. Be the first!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                        {images.map((img) => (
                            <CommunityCard
                                key={img.id}
                                image={img}
                                onLike={() => handleToggleLike(img.id)}
                                currentUserId={currentUserId}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Community;