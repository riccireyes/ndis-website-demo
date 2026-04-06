import sys
from PIL import Image

def trim_whitespace(img_path, output_path, padding=10):
    try:
        im = Image.open(img_path)
        
        # Crop 10 pixels from all edges first to ignore generic artifacts or borders that generators add
        width, height = im.size
        # Crop 10 pixels inwards
        cropped_in = im.crop((10, 10, width-10, height-10))

        if cropped_in.mode != 'RGB':
            rgb_im = cropped_in.convert('RGB')
        else:
            rgb_im = cropped_in

        # Ignore pixels lighter than 235 (light grays and whites)
        def threshold_fn(x):
            return 0 if x > 235 else 255

        r, g, b = rgb_im.split()
        r_thresh = r.point(threshold_fn)
        g_thresh = g.point(threshold_fn)
        b_thresh = b.point(threshold_fn)
        
        from PIL import ImageChops
        mask = ImageChops.add(ImageChops.add(r_thresh, g_thresh), b_thresh)

        bbox = mask.getbbox()
        
        if bbox:
            print(f"[{img_path}] Inner bbox found: {bbox}")
            # Add padding
            left, upper, right, lower = bbox
            inner_w, inner_h = cropped_in.size
            
            p_left = max(0, left - padding)
            p_upper = max(0, upper - padding)
            p_right = min(inner_w, right + padding)
            p_lower = min(inner_h, lower + padding)
            
            # Crop the inner image
            final_im = cropped_in.crop((p_left, p_upper, p_right, p_lower))
            final_im.save(output_path)
            print(f"[{img_path}] Cropped and saved to {output_path}")
        else:
            print(f"[{img_path}] Could not find a bounding box.")
            
    except Exception as e:
        print(f"Error processing {img_path}: {e}")

if __name__ == "__main__":
    for path in sys.argv[1:]:
        trim_whitespace(path, path, padding=12)
