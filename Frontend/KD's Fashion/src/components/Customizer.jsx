import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';
import './Customizer.css';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';


export default function Customizer() {
  const [color, setColor] = useState('#ffffff');
  const [images, setImages] = useState([]);
  const [price, setPrice] = useState(499);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isResizing, setIsResizing] = useState(false);
  const [showCartForm, setShowCartForm] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const { user } = useAuth();


  const handleAddToCart = async (cartData) => {
  try {
    const cartItem = {
      email: user.email,
      color: cartData.color,
      imagesUsed: cartData.imageCount,
      customizationFee: cartData.price - 499,
      totalPrice: cartData.price,
      size: cartData.size,
      quantity: cartData.quantity,
      snapshots: {
        front: cartData.snapshots[0],
        back: cartData.snapshots[1],
        left: cartData.snapshots[2],
        right: cartData.snapshots[3],
      },
      createdAt: new Date()
    };

    await axios.post('http://localhost:5000/api/cart/add', cartItem);
    alert("🛒 Item added to cart!");
  } catch (err) {
    console.error("❌ Failed to add to cart", err);
    alert("Failed to add to cart");
  }
};




  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isResizing && selectedIndex !== null) {
        setImages(prev => {
          const updated = [...prev];
          const newSize = Math.max(50, Math.min(400, updated[selectedIndex].size + e.movementX));
          updated[selectedIndex].size = newSize;
          return updated;
        });
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, selectedIndex]);


  const addImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          const updated = [...images, { img, x: 0.1, y: 0.1, size: 200 }];
          setImages(updated);
          setPrice(499 + updated.length * 50); // ₹50 per image
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleWheel = (e, index) => {
    e.preventDefault();
    const updated = [...images];
    const newSize = Math.max(50, Math.min(400, updated[index].size + e.deltaY * -0.1));
    updated[index].size = newSize;
    setImages(updated);
  };

  const deleteImage = (index) => {
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
    setPrice(499 + updated.length * 50);
  };

  const [fourSnapshots, setFourSnapshots] = useState([]);

const captureSnapshots = async ({ color, images, setFourSnapshots, setShowCartForm }) => {
  const views = [
    { name: 'front', y: 0 },
    { name: 'back', y: Math.PI },
    { name: 'left', y: Math.PI / 2 },
    { name: 'right', y: -Math.PI / 2 },
  ];

  const snapshots = [];

  // Create offscreen renderer
  const renderer = new THREE.WebGLRenderer({ preserveDrawingBuffer: true });
  renderer.setSize(500, 500);

  // Create scene and camera
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 1.5, 11); // Slightly above for better framing

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(5, 5, 5);

  scene.add(ambientLight, dirLight);

  // Load model
  const loader = new GLTFLoader();
  loader.load('/assets/tshirt.glb', (gltf) => {
    const model = gltf.scene;
    model.scale.set(1.5, 1.5, 1.5);
    scene.add(model);

    // Apply texture to shirt
    model.traverse((child) => {
      if (child.isMesh) {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 1024;
        const ctx = canvas.getContext('2d');

        // Flip Y to fix texture
        ctx.translate(0, canvas.height);
        ctx.scale(1, -1);

        ctx.fillStyle = color;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        images.forEach((img) => {
          const scale = 1024 / 500; // Assuming 500px template
          const px = img.x * scale;
          const py = img.y * scale;
          const size = img.size * scale;
          ctx.drawImage(img.img, px, py, size, size);
        });

        const texture = new THREE.CanvasTexture(canvas);
        child.material = new THREE.MeshStandardMaterial({ map: texture });
        child.material.needsUpdate = true;
      }
    });

    // Capture 4 snapshots
    views.forEach((view) => {
      model.rotation.set(0, view.y, 0);
      renderer.render(scene, camera);
      const snapshot = renderer.domElement.toDataURL('image/jpeg', 0.7);
      snapshots.push(snapshot);
    });

    setFourSnapshots(snapshots);
    setShowCartForm(true); // Open cart form
  });
};



  return (
    <div className="customizer-container" style={{ marginTop: '80px' }}>

         <div className="Topper-custome">
          <div className="left">
        <div className="template-editor">
          <h3>Drag Images on Template (Double-click to delete)</h3>
          <div
            className="template-canvas"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              const index = parseInt(e.dataTransfer.getData('imageIndex'));
              const rect = e.currentTarget.getBoundingClientRect();
              const x = (e.clientX - rect.left);
              const y = (e.clientY - rect.top);
      
              const updated = [...images];
              updated[index] = { ...updated[index], x, y };
              setImages(updated);
            }}
            style={{
              position: 'relative',
              backgroundImage: 'url("/assets/Template.png")',
              backgroundSize: 'cover',
              width: `500px`,
              height: `500px`,
              marginBottom: '20px',
              border: '2px dashed #555',
            }}
          >
            {images.map((img, i) => (
              <div
                key={i}
                onClick={() => setSelectedIndex(i)}
                onDoubleClick={() => deleteImage(i)}
                draggable
                onDragStart={(e) => e.dataTransfer.setData('imageIndex', i)}
                onDragEnd={(e) => {
                  const rect = e.currentTarget.parentNode.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  const updated = [...images];
                  updated[i] = { ...updated[i], x, y };
                  setImages(updated);
                }}
                style={{
                  position: 'absolute',
                  top: img.y,
                  left: img.x,
                  width: `${img.size}px`,
                  height: `${img.size}px`,
                  border: selectedIndex === i ? '2px solid blue' : 'none',
                  cursor: 'move',
                }}
              >
                <img
                  src={img.img.src}
                  style={{ width: '100%', height: '100%' }}
                  draggable={false}
                />
                {selectedIndex === i && (
                  <div
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      setIsResizing(true);
                    }}
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      width: '15px',
                      height: '15px',
                      background: 'blue',
                      cursor: 'nwse-resize'
                    }}
                  />
                )}
              </div>
            ))}
      
          </div>
        </div>


      <div className="controls">
        <label>Choose Color: <input type="color" value={color} onChange={(e) => setColor(e.target.value)} /></label>
        <label>Upload Image: <input type="file" onChange={addImage} /></label>
        <p>Base Price: ₹499</p>
        <p>Customization Fee: ₹{price - 499}</p>
        <p><strong>Total: ₹{price}</strong></p>
        <button
          onClick={() => captureSnapshots({
    color,
    images,
    setFourSnapshots,
    setShowCartForm
  })}
          style={{ marginTop: '20px', padding: '10px 20px' }}
        >
          Preview Design
        </button>

      </div>
      </div>

      <div className="canvas-wrapper">
       <Canvas
  camera={{ position: [0, 1.2, 10], fov: 45 }}
  style={{
    height: '480px',
    width: '40vw',
    borderRadius: '30px',
    marginBottom: '0px',
  }}
>
  <ambientLight intensity={0.8} />
  <directionalLight position={[5, 5, 5]} intensity={1} />
  <Model color={color} images={images} />
  <OrbitControls target={[0, 1, 0]} />
</Canvas>


      </div>
      </div>




      {showCartForm && (
  <div className="cart-form">
    <h3>Review Your T-Shirt Design</h3>
    <p><strong>Color:</strong> {color}</p>
    <p><strong>Images Used:</strong> {images.length}</p>
    <p><strong>Customization Fee:</strong> ₹{(price - 499)}</p>
    <p><strong>Total Price:</strong> ₹{price}</p>

    <form onSubmit={(e) => {
      e.preventDefault();
      const data = {
        color,
        imageCount: images.length,
        price,
        size: e.target.size.value,
        quantity: e.target.quantity.value,
        snapshots: fourSnapshots, // we'll generate this below
      };
      handleAddToCart(data);
setShowCartForm(false);

    }}>
      <label>
        Size:
        <select name="size" required>
          <option value="">Select</option>
          <option value="S">Small</option>
          <option value="M">Medium</option>
          <option value="L">Large</option>
          <option value="XL">Extra Large</option>
        </select>
      </label>
      <br />
      <label>
        Quantity:
        <input type="number" name="quantity" defaultValue={1} min={1} required />
      </label>

      <br />
      <h4>Snapshots (Front, Back, Left, Right)</h4>
      <div className="snapshot-grid">
        {fourSnapshots.map((snap, idx) => (
  <img key={idx} src={snap} alt={`Snapshot ${idx}`} width={100} />
))}


      </div>

      <br />
      <button onClick={() =>
  captureSnapshots({
    color,
    images,
    setFourSnapshots,
    setShowCartForm
  })
}>
  Add to Cart
</button>

    </form>
  </div>
)}

    </div>
  );
}



function Model({ color, images }) {
  const ref = useRef();
  const [model, setModel] = useState();

  useEffect(() => {
    const loader = new GLTFLoader();
    loader.load('/assets/tshirt.glb', (gltf) => {
      const shirt = gltf.scene;
      setModel(shirt);
    });
  }, []);

  useFrame(() => {
    if (model) model.rotation.y += 0.00;
  });

  useEffect(() => {
    if (!model) return;

    model.traverse((child) => {
      if (child.isMesh) {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 1024;

        const ctx = canvas.getContext('2d');

        // Flip Y to fix mirrored texture
        ctx.translate(0, canvas.height);
        ctx.scale(1, -1);

        ctx.fillStyle = color;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        images.forEach((img) => {
          // Scale position from display to canvas size
          const scaleX = 1024 / 500; // Template display width
          const scaleY = 1024 / 600; // Template display height

          const posX = img.x * scaleX;
          const posY = img.y * scaleY;

          ctx.drawImage(img.img, posX, posY, 200, 200);
        });

        const texture = new THREE.CanvasTexture(canvas);
        const mat = new THREE.MeshStandardMaterial({ map: texture });
        child.material = mat;
        child.material.needsUpdate = true;
      }
    });
  }, [color, images, model]);

  return model ? <primitive object={model} ref={ref} scale={1.5} position={[0, -1.1, 0]} /> : null;

}



