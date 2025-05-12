'use client'

import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { FileSpreadsheet, Link2 } from 'lucide-react'
import { useSyncContext } from '@/context/SyncContext'

interface GoogleSheetDialogProps {
    open: boolean
    onClose: () => void
    onSync: (option: 'create' | 'use', value: string) => void
}

export const GoogleSheetDialog: React.FC<GoogleSheetDialogProps> = ({ open, onClose, onSync }) => {
    const [option, setOption] = useState<'select' | 'create' | 'use'>('select')
    const { sheetURL } = useSyncContext()
    const [inputValue, setInputValue] = useState('')

    useEffect(() => {
        if (option === 'use') {
            setInputValue(sheetURL || '')
        } else {
            setInputValue('')
        }
    }, [option, sheetURL])

    const handleAccessSync = () => {
        if (!inputValue.trim()) {
            toast.error('Please enter a value')
            return
        }
        onSync(option === 'create' ? 'create' : 'use', inputValue.trim())
        onClose()
        setOption('select')
        setInputValue('')
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Google Sheet Sync</DialogTitle>
                </DialogHeader>

                {option === 'select' && (
                    <div className="flex flex-col gap-4">
                        <Button variant="outline" className='hover:bg-primary hover:text-card' onClick={() => setOption('create')}>
                            <FileSpreadsheet />Create new Google Sheet file
                        </Button>
                        <Button variant="outline" className='hover:bg-primary hover:text-card' onClick={() => setOption('use')}>
                            <Link2 /> Use current Google Sheet file
                        </Button>
                    </div>
                )}

                {option === 'create' && (
                    <div className="flex flex-col gap-4">
                        <Input
                            placeholder="Enter new file name"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                        />
                        <DialogFooter>
                            <Button onClick={handleAccessSync}>Access & Sync</Button>
                        </DialogFooter>
                    </div>
                )}

                {option === 'use' && (
                    <div className="flex flex-col gap-4">
                        <Input
                            placeholder="Enter Google Sheet link"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                        />
                        <DialogFooter>
                            <Button onClick={handleAccessSync}>Access & Sync</Button>
                        </DialogFooter>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
