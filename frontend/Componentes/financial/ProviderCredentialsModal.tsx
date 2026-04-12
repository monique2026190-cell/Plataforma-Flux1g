
import React, { useState, useEffect } from 'react';
import './ProviderCredentialsModal.css';

interface Field {
    name: string;
    label: string;
    type: string;
    placeholder: string;
}

interface ProviderCredentialsModalProps {
    isOpen: boolean;
    onClose: () => void;
    providerName: string;
    fields: Field[];
    onSave: (credentials: Record<string, string>) => Promise<void>;
    existingCredentials?: Record<string, string>;
}

export const ProviderCredentialsModal: React.FC<ProviderCredentialsModalProps> = ({ isOpen, onClose, providerName, fields, onSave, existingCredentials }) => {
    const [credentials, setCredentials] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            // Pre-fill with existing credentials or initialize empty
            const initialCreds = fields.reduce((acc, field) => {
                acc[field.name] = existingCredentials?.[field.name] || '';
                return acc;
            }, {} as Record<string, string>);
            setCredentials(initialCreds);
        }
    }, [isOpen, fields, existingCredentials]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSave(credentials);
            onClose();
        } catch (error) {
            console.error(`Falha ao salvar credenciais do ${providerName}`, error);
            // Optionally, display an error message to the user
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <h2 className="modal-title">Conectar com {providerName}</h2>
                    <div className="modal-body">
                        {fields.map(field => (
                            <div className="form-group" key={field.name}>
                                <label htmlFor={field.name}>{field.label}</label>
                                <input
                                    id={field.name}
                                    name={field.name}
                                    type={field.type}
                                    value={credentials[field.name] || ''}
                                    onChange={handleChange}
                                    placeholder={field.placeholder}
                                    required
                                />
                            </div>
                        ))}
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="form-button cancel" onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="submit" className="form-button save" disabled={isSubmitting}>
                            {isSubmitting ? 'Salvando...' : 'Salvar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
