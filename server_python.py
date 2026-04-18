from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
import os
from datetime import datetime
import json

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///purohit_registration.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['MAX_CONTENT_LENGTH'] = 5 * 1024 * 1024  # 5MB max file size
app.config['UPLOAD_FOLDER'] = 'uploads'

# Create uploads folder if it doesn't exist
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Initialize database
db = SQLAlchemy(app)

# Database Model
class Purohit(db.Model):
    __tablename__ = 'purohits'
    
    id = db.Column(db.Integer, primary_key=True)
    photo = db.Column(db.String(255))
    name = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(10), unique=True, nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=True)
    password = db.Column(db.String(255), nullable=False)
    dob = db.Column(db.Date, nullable=False)
    
    # Vedas (stored as JSON)
    vedas = db.Column(db.JSON, default={
        'rigveda': False,
        'yajurveda': False,
        'samaveda': False,
        'atharvaveda': False
    })
    
    # Sub-vedas (stored as JSON array)
    sub_vedas = db.Column(db.JSON, default=[])
    
    upanayana = db.Column(db.String(10), nullable=False)
    married = db.Column(db.String(10), nullable=True)
    gotram = db.Column(db.String(255), nullable=False)
    upasana = db.Column(db.String(255), nullable=True)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self, include_password=False):
        data = {
            'id': self.id,
            'photo': self.photo,
            'name': self.name,
            'phone': self.phone,
            'email': self.email,
            'dob': self.dob.isoformat() if self.dob else None,
            'vedas': self.vedas,
            'sub_vedas': self.sub_vedas,
            'upanayana': self.upanayana,
            'married': self.married,
            'gotram': self.gotram,
            'upasana': self.upasana,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
        }
        if include_password:
            data['password'] = self.password
        return data

# Routes

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'Backend is running!'})

@app.route('/api/register', methods=['POST'])
def register():
    try:
        # Get form data
        data = request.form
        
        # Validate required fields
        required_fields = ['name', 'phone', 'password', 'dob', 'gotram', 'upanayana']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({'message': f'{field} is required'}), 400
        
        # Validate phone format
        phone = data.get('phone', '').strip()
        if not phone.isdigit() or len(phone) != 10:
            return jsonify({'message': 'Valid 10-digit phone number required'}), 400
        
        # Check if phone already exists
        if Purohit.query.filter_by(phone=phone).first():
            return jsonify({'message': 'Phone number already registered'}), 400
        
        # Check if email already exists (if provided)
        email = data.get('email', '').strip() or None
        if email and Purohit.query.filter_by(email=email).first():
            return jsonify({'message': 'Email already registered'}), 400
        
        # Validate password length
        password = data.get('password', '')
        if len(password) < 6:
            return jsonify({'message': 'Password must be at least 6 characters'}), 400
        
        # Handle photo upload
        photo_path = None
        if 'photo' in request.files:
            file = request.files['photo']
            if file and file.filename:
                allowed_extensions = {'jpeg', 'jpg', 'png', 'gif'}
                file_ext = file.filename.rsplit('.', 1)[1].lower() if '.' in file.filename else ''
                
                if file_ext not in allowed_extensions:
                    return jsonify({'message': 'Only image files are allowed'}), 400
                
                filename = secure_filename(f"purohit_{datetime.utcnow().timestamp()}_{file.filename}")
                file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
                photo_path = f"/uploads/{filename}"
        
        # Parse vedas
        vedas = json.loads(data.get('vedas', '{}')) if isinstance(data.get('vedas'), str) else {}
        if not vedas:
            vedas = {'rigveda': False, 'yajurveda': False, 'samaveda': False, 'atharvaveda': False}
        
        # Parse sub-vedas
        sub_vedas = json.loads(data.get('subVedas', '[]')) if isinstance(data.get('subVedas'), str) else []
        
        # Get married status
        married = data.get('married', None) if data.get('upanayana') == 'yes' else None
        
        # Create new Purohit
        new_purohit = Purohit(
            photo=photo_path or '/uploads/default.png',
            name=data.get('name', '').strip(),
            phone=phone,
            email=email,
            password=generate_password_hash(password),
            dob=datetime.fromisoformat(data.get('dob', '').split('T')[0]),
            vedas=vedas,
            sub_vedas=sub_vedas,
            upanayana=data.get('upanayana', ''),
            married=married,
            gotram=data.get('gotram', '').strip(),
            upasana=data.get('upasana', '').strip() or None,
        )
        
        # Save to database
        db.session.add(new_purohit)
        db.session.commit()
        
        return jsonify({
            'message': 'Registration successful!',
            'data': {
                'id': new_purohit.id,
                'name': new_purohit.name,
                'phone': new_purohit.phone,
                'email': new_purohit.email,
            }
        }), 201
        
    except Exception as error:
        db.session.rollback()
        print(f"Registration error: {str(error)}")
        return jsonify({'message': 'Server error', 'error': str(error)}), 500

@app.route('/api/purohits', methods=['GET'])
def get_all_purohits():
    try:
        purohits = Purohit.query.all()
        return jsonify([p.to_dict() for p in purohits]), 200
    except Exception as error:
        return jsonify({'message': 'Server error', 'error': str(error)}), 500

@app.route('/api/purohit/<int:purohit_id>', methods=['GET'])
def get_purohit(purohit_id):
    try:
        purohit = Purohit.query.get(purohit_id)
        if not purohit:
            return jsonify({'message': 'Purohit not found'}), 404
        return jsonify(purohit.to_dict()), 200
    except Exception as error:
        return jsonify({'message': 'Server error', 'error': str(error)}), 500

@app.route('/api/purohit/<int:purohit_id>', methods=['PUT'])
def update_purohit(purohit_id):
    try:
        purohit = Purohit.query.get(purohit_id)
        if not purohit:
            return jsonify({'message': 'Purohit not found'}), 404
        
        data = request.get_json()
        
        # Update fields
        if 'name' in data:
            purohit.name = data['name'].strip()
        if 'phone' in data:
            phone = data['phone'].strip()
            if phone != purohit.phone and Purohit.query.filter_by(phone=phone).first():
                return jsonify({'message': 'Phone number already registered'}), 400
            purohit.phone = phone
        if 'email' in data:
            email = data['email'].strip() or None
            if email and email != purohit.email and Purohit.query.filter_by(email=email).first():
                return jsonify({'message': 'Email already registered'}), 400
            purohit.email = email
        if 'gotram' in data:
            purohit.gotram = data['gotram'].strip()
        if 'upasana' in data:
            purohit.upasana = data['upasana'].strip() or None
        
        purohit.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': 'Updated successfully',
            'data': purohit.to_dict()
        }), 200
    except Exception as error:
        db.session.rollback()
        return jsonify({'message': 'Server error', 'error': str(error)}), 500

@app.route('/api/purohit/<int:purohit_id>', methods=['DELETE'])
def delete_purohit(purohit_id):
    try:
        purohit = Purohit.query.get(purohit_id)
        if not purohit:
            return jsonify({'message': 'Purohit not found'}), 404
        
        db.session.delete(purohit)
        db.session.commit()
        
        return jsonify({'message': 'Deleted successfully'}), 200
    except Exception as error:
        db.session.rollback()
        return jsonify({'message': 'Server error', 'error': str(error)}), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({'message': 'Route not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return jsonify({'message': 'Server error'}), 500

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    port = int(os.getenv('PORT', 5000))
    app.run(debug=os.getenv('NODE_ENV') == 'development', port=port)
