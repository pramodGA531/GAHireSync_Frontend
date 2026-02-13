import os

file_path = r"d:\GA_HireSync\RMS_FRONTEND_NEW\src\components\dashboard\client\PostingNewJob\PostJob.jsx"

# The replacement content block
new_content_block = """            {currentStep >= 3 && (
                <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
                    {/* Expandable Panel */}
                    <div
                        className={`bg-white rounded-2xl shadow-2xl border border-gray-100 transition-all duration-300 ease-in-out overflow-hidden mb-4 ${
                            isChatExpanded
                                ? "w-[33.33vw] h-[70vh] opacity-100"
                                : "w-0 h-0 opacity-0 pointer-events-none"
                        }`}
                    >
                        <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                            <h3 className="font-semibold text-gray-800">
                                Generative job description
                            </h3>
                            <Button
                                type="text"
                                icon={<CloseOutlined />}
                                onClick={() => setIsChatExpanded(false)}
                                className="hover:bg-gray-200 rounded-full"
                            />
                        </div>
                        <div className="p-6 h-[calc(70vh-64px)] overflow-y-auto flex flex-col items-center justify-center">
                            <div className="text-center text-gray-400 mb-8">
                                <MessageOutlined style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }} />
                                <p>AI Assistant is ready to help you write the job description.</p>
                            </div>
                            
                            <div className="w-full space-y-4">
                                <div className="h-4 bg-gray-100 rounded w-3/4 animate-pulse mx-auto" />
                                <div className="h-4 bg-gray-100 rounded w-1/2 animate-pulse mx-auto" />
                            </div>
                        </div>
                    </div>

                    {/* Floating Action Button */}
                    <Button
                        type="primary"
                        shape="circle"
                        size="large"
                        icon={isChatExpanded ? <CloseOutlined /> : <MessageOutlined />}
                        onClick={() => setIsChatExpanded(!isChatExpanded)}
                        style={{
                            width: '60px',
                            height: '60px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '24px'
                        }}
                    />
                </div>
            )}"""

with open(file_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

# Verify the lines to replace are approximately correct to avoid destroying the file
# Lines 614-712 (1-indexed) -> 613-712 (0-indexed slice)
# Line 614 in file should start with <div and end line 712 should be </div> or contain </div>

start_idx = 613
end_idx = 712

# Simple safety check: check if lines exist
if len(lines) < end_idx:
    print(
        f"Error: File has fewer lines ({len(lines)}) than expected end index ({end_idx})"
    )
    exit(1)

# Check context
print(f"Replacing lines {start_idx+1} to {end_idx}...")
print(f"Before: {lines[start_idx].strip()}")
print(f"After: {lines[end_idx-1].strip()}")

# Perform replacement
# We replace the slice with the new content (as a list of one string, split by newline if needed, or just insert)
new_lines_list = [line + "\n" for line in new_content_block.split("\n")]
# Remove the trailing newline on the last item if it was added unnecessarily, but split adds empty strings?
# actually split("\n") gives lines without newline chars.
new_lines_with_formatting = [line + "\n" for line in new_content_block.split("\n")]

lines[start_idx:end_idx] = new_lines_with_formatting

with open(file_path, "w", encoding="utf-8") as f:
    f.writelines(lines)

print("Replacement complete.")
