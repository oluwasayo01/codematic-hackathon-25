from datetime import datetime
from google.cloud import firestore
from src.config import db


class BaseModel:
    """Base model with common Firestore operations"""
    
    collection_name = None  # Override in subclasses
    
    def __init__(self, **kwargs):
        self.id = kwargs.get('id', None)
        for key, value in kwargs.items():
            setattr(self, key, value)
    
    @classmethod
    def get_collection(cls):
        """Get Firestore collection reference"""
        return db.collection(cls.collection_name)
    
    def to_dict(self):
        """Convert model to dictionary, excluding None values and id"""
        data = {}
        for key, value in self.__dict__.items():
            if value is not None and key != 'id':
                if isinstance(value, datetime):
                    data[key] = value
                else:
                    data[key] = value
        return data
    
    def save(self):
        """Save or update document in Firestore"""
        data = self.to_dict()
        data['updated_at'] = firestore.SERVER_TIMESTAMP
        
        if self.id:
            # Update existing document
            self.get_collection().document(self.id).set(data, merge=True)
        else:
            # Create new document
            data['created_at'] = firestore.SERVER_TIMESTAMP
            doc_ref = self.get_collection().add(data)
            self.id = doc_ref[1].id
        
        return self.id
    
    @classmethod
    def get_by_id(cls, doc_id):
        """Retrieve document by ID"""
        if not doc_id:
            return None
            
        doc = cls.get_collection().document(doc_id).get()
        if doc.exists:
            data = doc.to_dict()
            data['id'] = doc.id
            return cls(**data)
        return None
    
    @classmethod
    def get_all(cls, filters=None, order_by=None, limit=None):
        """Get multiple documents with optional filters"""
        query = cls.get_collection()
        
        if filters:
            for field, operator, value in filters:
                query = query.where(field, operator, value)
        
        if order_by:
            direction = firestore.Query.DESCENDING if order_by.startswith('-') else firestore.Query.ASCENDING
            field = order_by.lstrip('-')
            query = query.order_by(field, direction=direction)
        
        if limit:
            query = query.limit(limit)
        
        docs = query.stream()
        results = []
        for doc in docs:
            data = doc.to_dict()
            data['id'] = doc.id
            results.append(cls(**data))
        
        return results
    
    def delete(self):
        """Delete document from Firestore"""
        if self.id:
            self.get_collection().document(self.id).delete()
            return True
        return False
    
    @classmethod
    def exists(cls, field, value):
        """Check if a document exists with given field value"""
        docs = cls.get_all(filters=[(field, '==', value)], limit=1)
        return len(docs) > 0